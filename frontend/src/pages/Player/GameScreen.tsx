import React, { useState, useEffect } from 'react';
import { FaCrown, FaTrophy, FaSignOutAlt } from 'react-icons/fa';
import apiService from '../../services/api';
import socketService from '../../services/socket';
import {
  Game,
  Question,
  Leaderboard,
  QuestionStartedData,
  QuestionEndedData,
  AnswerResultData,
} from '../../types';

interface GameScreenProps {
  user: { id: string; username: string };
  gameCode: string;
  onLogout: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ user, gameCode, onLogout }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; points: number } | null>(
    null
  );
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [joinedGame, setJoinedGame] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameCode) {
        setError('No game code provided');
        return;
      }

      try {
        const response = await apiService.getGame(gameCode);
        setGame(response.game);

        // Join game via socket
        socketService.joinGame(gameCode, user.id);
        setJoinedGame(true);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to join game');
      }
    };

    fetchGame();
  }, [gameCode, user.id]);

  useEffect(() => {
    if (!joinedGame) return;

    // Socket event listeners
    socketService.onGameState((newGame) => {
      setGame(newGame);
    });

    socketService.onQuestionStarted((data: QuestionStartedData) => {
      setCurrentQuestion(data.question);
      setRemainingTime(Math.ceil((data.endTime - Date.now()) / 1000));
      setHasAnswered(false);
      setSelectedAnswer(null);
      setAnswerResult(null);
      setCorrectAnswer(null);
    });

    socketService.onQuestionEnded((data: QuestionEndedData) => {
      setCorrectAnswer(data.correctAnswer);
      setRemainingTime(0);
    });

    socketService.onLeaderboardUpdated((newLeaderboard) => {
      setLeaderboard(newLeaderboard);
    });

    socketService.onAnswerResult((data: AnswerResultData) => {
      if (data.userId === user.id) {
        setAnswerResult({
          isCorrect: data.isCorrect,
          points: data.pointsAwarded,
        });
      }
    });

    socketService.onTimerTick((time) => {
      setRemainingTime(time);
    });

    socketService.onError((message) => {
      setError(message);
    });

    return () => {
      socketService.offGameState();
      socketService.offQuestionStarted();
      socketService.offQuestionEnded();
      socketService.offLeaderboardUpdated();
      socketService.offAnswerResult();
      socketService.offTimerTick();
      socketService.offError();
    };
  }, [joinedGame, user.id]);

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered || remainingTime <= 0) return;

    setSelectedAnswer(answer);
    setHasAnswered(true);

    // Submit answer
    if (game && currentQuestion) {
      socketService.submitAnswer(game.id, currentQuestion.id, user.id, answer);
    }
  };

  const getUserRank = () => {
    if (!leaderboard) return null;
    const entry = leaderboard.players.find((p) => p.userId === user.id);
    return entry ? entry.rank : null;
  };

  const getUserScore = () => {
    if (!leaderboard) return 0;
    const entry = leaderboard.players.find((p) => p.userId === user.id);
    return entry ? entry.score : 0;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button onClick={onLogout} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">{game.name}</h1>
              <p className="text-gray-600">
                Playing as: <span className="font-semibold">{user.username}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{getUserScore()}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              {getUserRank() && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">#{getUserRank()}</div>
                  <div className="text-sm text-gray-600">Rank</div>
                </div>
              )}
              <button onClick={onLogout} className="btn btn-danger">
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Main Area */}
        <div className="md:col-span-2">
          {game.status === 'waiting' && (
            <div className="card text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Waiting for game to start...</h2>
              <p className="text-gray-600">The DJ will start the game soon!</p>
            </div>
          )}

          {game.status === 'active' && currentQuestion && (
            <div className="space-y-6">
              {/* Timer */}
              <div className="card text-center">
                <div
                  className={`text-6xl font-bold mb-2 ${
                    remainingTime <= 5 ? 'text-red-600 animate-pulse' : 'text-primary'
                  }`}
                >
                  {remainingTime}s
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      remainingTime <= 5 ? 'bg-red-600' : 'bg-primary'
                    }`}
                    style={{
                      width: `${(remainingTime / game.answerTimeLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="card">
                <h2 className="text-2xl font-bold text-center mb-6">
                  What is the name of this track?
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={hasAnswered || remainingTime <= 0}
                      className={`w-full p-4 rounded-lg font-semibold text-lg transition-all ${
                        correctAnswer
                          ? option === correctAnswer
                            ? 'bg-green-500 text-white'
                            : option === selectedAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                          : selectedAnswer === option
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200 active:scale-95'
                      } ${hasAnswered || remainingTime <= 0 ? 'cursor-not-allowed' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Answer Result */}
                {answerResult && (
                  <div
                    className={`mt-6 p-4 rounded-lg text-center ${
                      answerResult.isCorrect
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="text-xl font-bold mb-2">
                      {answerResult.isCorrect ? '✅ Correct!' : '❌ Wrong!'}
                    </div>
                    {answerResult.isCorrect && (
                      <div className="text-lg">+{answerResult.points} points</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {game.status === 'paused' && (
            <div className="card text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Game Paused</h2>
              <p className="text-gray-600">The DJ has paused the game</p>
            </div>
          )}

          {game.status === 'finished' && (
            <div className="card text-center py-12">
              <h2 className="text-4xl font-bold mb-4">🎉 Game Finished!</h2>
              <p className="text-xl text-gray-600 mb-6">Thanks for playing!</p>
              {getUserRank() === 1 && (
                <div className="text-6xl mb-4">
                  <FaCrown className="inline text-yellow-500" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="md:col-span-1">
          <div className="card sticky top-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              Leaderboard
            </h3>
            {leaderboard && leaderboard.players.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.players.slice(0, 10).map((player) => (
                  <div
                    key={player.userId}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      player.userId === user.id
                        ? 'bg-primary text-white font-bold'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold ${
                          player.rank === 1
                            ? 'text-yellow-500'
                            : player.rank === 2
                            ? 'text-gray-400'
                            : player.rank === 3
                            ? 'text-orange-600'
                            : ''
                        }`}
                      >
                        #{player.rank}
                      </span>
                      <span className="truncate">{player.username}</span>
                    </div>
                    <span className="font-bold">{player.score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No players yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
