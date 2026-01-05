import React, { useState, useEffect } from 'react';
import { FaTrophy, FaCrown, FaMedal } from 'react-icons/fa';
import apiService from '../../services/api';
import socketService from '../../services/socket';
import { Game, Question, Leaderboard, QuestionStartedData } from '../../types';

const DisplayPage: React.FC = () => {
  const [gameCode, setGameCode] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showJoinPrompt, setShowJoinPrompt] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!game) return;

    // Socket event listeners
    socketService.onGameState((updatedGame) => {
      setGame(updatedGame);
    });

    socketService.onQuestionStarted((data: QuestionStartedData) => {
      setCurrentQuestion(data.question);
      setRemainingTime(Math.ceil((data.endTime - Date.now()) / 1000));
      setCorrectAnswer(null);
    });

    socketService.onQuestionEnded((data) => {
      setCorrectAnswer(data.correctAnswer);
      setRemainingTime(0);
    });

    socketService.onLeaderboardUpdated((newLeaderboard) => {
      setLeaderboard(newLeaderboard);
    });

    socketService.onTimerTick((time) => {
      setRemainingTime(time);
    });

    return () => {
      socketService.offGameState();
      socketService.offQuestionStarted();
      socketService.offQuestionEnded();
      socketService.offLeaderboardUpdated();
      socketService.offTimerTick();
    };
  }, [game]);

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameCode.trim()) return;

    try {
      const response = await apiService.getGame(gameCode.toUpperCase());
      setGame(response.game);
      setShowJoinPrompt(false);

      // Fetch initial leaderboard
      const leaderboardResponse = await apiService.getLeaderboard(response.game.id);
      setLeaderboard(leaderboardResponse.leaderboard);
    } catch (err: any) {
      alert('Game not found');
    }
  };

  if (showJoinPrompt || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-4xl font-bold text-center text-primary mb-6">
              🎵 Display Mode
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Enter the game code to display the leaderboard
            </p>
            <form onSubmit={handleJoinGame}>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="Enter game code"
                className="input text-center text-2xl font-bold mb-4"
                maxLength={6}
                required
              />
              <button type="submit" className="btn btn-primary w-full text-lg">
                Connect to Game
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const top3 = leaderboard?.players.slice(0, 3) || [];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary">{game.name}</h1>
              <p className="text-xl text-gray-600">Code: {game.code}</p>
            </div>
            <div className={`px-6 py-3 rounded-full font-bold text-2xl ${
              game.status === 'active' ? 'bg-green-500 text-white' :
              game.status === 'waiting' ? 'bg-yellow-500 text-white' :
              game.status === 'paused' ? 'bg-red-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {game.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Current Question */}
        {game.status === 'active' && currentQuestion && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                What is the name of this track?
              </h2>

              {/* Timer */}
              <div className={`text-8xl font-bold mb-6 ${
                remainingTime <= 5 ? 'text-red-600 animate-pulse' : 'text-primary'
              }`}>
                {remainingTime}s
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-8 mb-6">
                <div
                  className={`h-8 rounded-full transition-all duration-1000 ${
                    remainingTime <= 5 ? 'bg-red-600' : 'bg-primary'
                  }`}
                  style={{
                    width: `${(remainingTime / game.answerTimeLimit) * 100}%`,
                  }}
                />
              </div>

              {/* Show correct answer when revealed */}
              {correctAnswer && (
                <div className="bg-green-500 text-white p-6 rounded-xl">
                  <div className="text-2xl font-bold mb-2">Correct Answer:</div>
                  <div className="text-4xl font-bold">{correctAnswer}</div>
                  <div className="text-xl mt-2 opacity-90">{currentQuestion.artistName}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Waiting/Paused State */}
        {(game.status === 'waiting' || game.status === 'paused') && (
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-8 text-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              {game.status === 'waiting' ? 'Waiting to Start' : 'Game Paused'}
            </h2>
            <p className="text-2xl text-gray-600">
              {game.status === 'waiting'
                ? 'Scan the QR code to join!'
                : 'Game will resume shortly'}
            </p>
          </div>
        )}

        {/* Finished State */}
        {game.status === 'finished' && (
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-8 text-center">
            <h2 className="text-6xl font-bold text-primary mb-4">🎉 Game Over!</h2>
            <p className="text-3xl text-gray-600">Thanks for playing!</p>
          </div>
        )}

        {/* Podium (Top 3) */}
        {top3.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <FaTrophy className="text-yellow-500" />
              Top Players
            </h2>
            <div className="flex items-end justify-center gap-6 mb-8">
              {/* 2nd Place */}
              {top3[1] && (
                <div className="flex flex-col items-center">
                  <div className="bg-gray-300 rounded-2xl p-6 w-48 text-center">
                    <FaMedal className="text-6xl text-gray-500 mx-auto mb-3" />
                    <div className="text-4xl font-bold mb-2">2nd</div>
                    <div className="text-xl font-semibold mb-2 truncate">{top3[1].username}</div>
                    <div className="text-3xl font-bold text-primary">{top3[1].score}</div>
                    <div className="text-sm text-gray-600">{top3[1].correctAnswers} correct</div>
                  </div>
                  <div className="bg-gray-300 w-48 h-32 rounded-t-2xl mt-4"></div>
                </div>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-400 rounded-2xl p-8 w-56 text-center">
                    <FaCrown className="text-7xl text-yellow-600 mx-auto mb-3" />
                    <div className="text-5xl font-bold mb-2">1st</div>
                    <div className="text-2xl font-bold mb-2 truncate">{top3[0].username}</div>
                    <div className="text-4xl font-bold text-primary">{top3[0].score}</div>
                    <div className="text-sm text-gray-700">{top3[0].correctAnswers} correct</div>
                  </div>
                  <div className="bg-yellow-400 w-56 h-48 rounded-t-2xl mt-4"></div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="flex flex-col items-center">
                  <div className="bg-orange-300 rounded-2xl p-6 w-48 text-center">
                    <FaMedal className="text-6xl text-orange-600 mx-auto mb-3" />
                    <div className="text-4xl font-bold mb-2">3rd</div>
                    <div className="text-xl font-semibold mb-2 truncate">{top3[2].username}</div>
                    <div className="text-3xl font-bold text-primary">{top3[2].score}</div>
                    <div className="text-sm text-gray-600">{top3[2].correctAnswers} correct</div>
                  </div>
                  <div className="bg-orange-300 w-48 h-24 rounded-t-2xl mt-4"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        {leaderboard && leaderboard.players.length > 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Full Rankings</h3>
            <div className="space-y-2">
              {leaderboard.players.slice(3).map((player) => (
                <div key={player.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-600 w-12">#{player.rank}</span>
                    <span className="text-xl font-semibold">{player.username}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{player.score}</div>
                    <div className="text-sm text-gray-600">{player.correctAnswers} correct</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players Count */}
        {leaderboard && (
          <div className="mt-6 text-center text-white text-xl">
            👥 {leaderboard.players.length} {leaderboard.players.length === 1 ? 'player' : 'players'} in the game
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPage;
