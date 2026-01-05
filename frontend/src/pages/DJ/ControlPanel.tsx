import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { FaPlay, FaStop, FaPause, FaPlus, FaArrowLeft, FaSearch } from 'react-icons/fa';
import apiService from '../../services/api';
import socketService from '../../services/socket';
import { Game, QuestionWithAnswer, Leaderboard, SpotifyTrack } from '../../types';

interface ControlPanelProps {
  game: Game;
  user: { id: string; username: string };
  onBack: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ game: initialGame, user, onBack }) => {
  const [game, setGame] = useState<Game>(initialGame);
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showSpotifySearch, setShowSpotifySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [spotifyTracks, setSpotifyTracks] = useState<SpotifyTrack[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const qrCodeUrl = `${window.location.origin}/play?code=${game.code}`;

  useEffect(() => {
    fetchQuestions();
    fetchLeaderboard();

    // Socket listeners
    socketService.onGameState((updatedGame) => {
      setGame(updatedGame);
    });

    socketService.onLeaderboardUpdated((newLeaderboard) => {
      setLeaderboard(newLeaderboard);
    });

    return () => {
      socketService.offGameState();
      socketService.offLeaderboardUpdated();
    };
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await apiService.getQuestions(game.id);
      setQuestions(response.questions);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await apiService.getLeaderboard(game.id);
      setLeaderboard(response.leaderboard);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  const handleSearchSpotify = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await apiService.searchTracks(searchQuery, 10);
      setSpotifyTracks(response.tracks);
    } catch (err) {
      console.error('Spotify search failed:', err);
      alert('Spotify search failed. Make sure credentials are configured.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddQuestionFromSpotify = async (track: SpotifyTrack) => {
    try {
      // Generate wrong options (simple approach: use other artists from search)
      const options = [
        track.name,
        ...spotifyTracks
          .filter((t) => t.id !== track.id)
          .slice(0, 3)
          .map((t) => t.name),
      ].sort(() => Math.random() - 0.5);

      await apiService.addQuestion({
        gameId: game.id,
        trackName: track.name,
        artistName: track.artists[0].name,
        albumName: track.album.name,
        correctAnswer: track.name,
        options,
        spotifyTrackId: track.id,
        duration: game.answerTimeLimit,
      });

      await fetchQuestions();
      setShowSpotifySearch(false);
      setSpotifyTracks([]);
      setSearchQuery('');
      alert('Question added successfully!');
    } catch (err) {
      console.error('Failed to add question:', err);
      alert('Failed to add question');
    }
  };

  const handleManualAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const trackName = formData.get('trackName') as string;
    const artistName = formData.get('artistName') as string;
    const option2 = formData.get('option2') as string;
    const option3 = formData.get('option3') as string;
    const option4 = formData.get('option4') as string;

    const options = [trackName, option2, option3, option4].sort(() => Math.random() - 0.5);

    try {
      await apiService.addQuestion({
        gameId: game.id,
        trackName,
        artistName,
        correctAnswer: trackName,
        options,
        duration: game.answerTimeLimit,
      });

      await fetchQuestions();
      setShowAddQuestion(false);
      form.reset();
      alert('Question added successfully!');
    } catch (err) {
      console.error('Failed to add question:', err);
      alert('Failed to add question');
    }
  };

  const handleStartQuestion = () => {
    if (questions.length === 0) {
      alert('Add questions first!');
      return;
    }

    const question = questions[currentQuestionIndex];
    socketService.startQuestion(game.id, question.id);
  };

  const handleEndQuestion = () => {
    socketService.endQuestion(game.id);

    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePauseGame = () => {
    socketService.pauseGame(game.id);
  };

  const handleResumeGame = () => {
    socketService.resumeGame(game.id);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={onBack} className="text-primary hover:underline mb-2 flex items-center gap-2">
                <FaArrowLeft /> Back to Create
              </button>
              <h1 className="text-3xl font-bold text-primary">{game.name}</h1>
              <p className="text-gray-600">
                Game Code: <span className="font-bold text-2xl">{game.code}</span>
              </p>
              <span className={`badge mt-2 ${
                game.status === 'active' ? 'badge-success' :
                game.status === 'waiting' ? 'badge-warning' :
                game.status === 'paused' ? 'badge-danger' : 'badge-primary'
              }`}>
                {game.status.toUpperCase()}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <QRCode value={qrCodeUrl} size={150} />
              <p className="text-xs text-center mt-2">Scan to join</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <div className="md:col-span-2 space-y-6">
            {/* Game Controls */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Game Controls</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleStartQuestion}
                  disabled={game.status === 'active' && game.currentQuestionId !== undefined}
                  className="btn btn-success flex items-center justify-center gap-2"
                >
                  <FaPlay /> Start Question
                </button>
                <button
                  onClick={handleEndQuestion}
                  disabled={!game.currentQuestionId}
                  className="btn btn-danger flex items-center justify-center gap-2"
                >
                  <FaStop /> End Question
                </button>
                <button
                  onClick={handlePauseGame}
                  disabled={game.status !== 'active'}
                  className="btn btn-warning flex items-center justify-center gap-2"
                >
                  <FaPause /> Pause Game
                </button>
                <button
                  onClick={handleResumeGame}
                  disabled={game.status !== 'paused'}
                  className="btn btn-primary flex items-center justify-center gap-2"
                >
                  <FaPlay /> Resume Game
                </button>
              </div>

              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  Current Question: {currentQuestionIndex + 1} of {questions.length}
                </p>
                {questions[currentQuestionIndex] && (
                  <p className="font-semibold">
                    {questions[currentQuestionIndex].trackName} - {questions[currentQuestionIndex].artistName}
                  </p>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Questions ({questions.length})</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSpotifySearch(!showSpotifySearch)}
                    className="btn btn-secondary text-sm"
                  >
                    <FaSearch className="inline mr-2" />
                    Spotify
                  </button>
                  <button
                    onClick={() => setShowAddQuestion(!showAddQuestion)}
                    className="btn btn-primary text-sm"
                  >
                    <FaPlus className="inline mr-2" />
                    Manual
                  </button>
                </div>
              </div>

              {/* Spotify Search */}
              {showSpotifySearch && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Spotify..."
                      className="input flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchSpotify()}
                    />
                    <button onClick={handleSearchSpotify} className="btn btn-primary" disabled={searchLoading}>
                      {searchLoading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  {spotifyTracks.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {spotifyTracks.map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center justify-between p-2 bg-white rounded hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            {track.album.images[0] && (
                              <img src={track.album.images[0].url} alt="" className="w-12 h-12 rounded" />
                            )}
                            <div>
                              <div className="font-semibold">{track.name}</div>
                              <div className="text-sm text-gray-600">{track.artists[0].name}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddQuestionFromSpotify(track)}
                            className="btn btn-primary text-sm"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Manual Add Question */}
              {showAddQuestion && (
                <form onSubmit={handleManualAddQuestion} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <input name="trackName" placeholder="Track Name (Correct Answer)" className="input" required />
                  <input name="artistName" placeholder="Artist Name" className="input" required />
                  <input name="option2" placeholder="Wrong Answer 1" className="input" required />
                  <input name="option3" placeholder="Wrong Answer 2" className="input" required />
                  <input name="option4" placeholder="Wrong Answer 3" className="input" required />
                  <button type="submit" className="btn btn-primary w-full">
                    Add Question
                  </button>
                </form>
              )}

              {/* Questions List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-lg ${
                      index === currentQuestionIndex ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold">
                      {index + 1}. {q.trackName}
                    </div>
                    <div className="text-sm opacity-90">{q.artistName}</div>
                  </div>
                ))}
                {questions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No questions yet. Add some!</p>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="md:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
              {leaderboard && leaderboard.players.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.players.map((player) => (
                    <div key={player.userId} className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-semibold">
                          #{player.rank} {player.username}
                        </div>
                        <div className="text-sm text-gray-600">
                          {player.correctAnswers} correct
                        </div>
                      </div>
                      <div className="text-xl font-bold text-primary">{player.score}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No players yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
