import React, { useState } from 'react';
import { FaMusic, FaClock } from 'react-icons/fa';
import apiService from '../../services/api';
import { Game } from '../../types';

interface CreateGameScreenProps {
  user: { id: string; username: string };
  onGameCreated: (game: Game) => void;
}

const CreateGameScreen: React.FC<CreateGameScreenProps> = ({ user, onGameCreated }) => {
  const [gameName, setGameName] = useState('');
  const [answerTimeLimit, setAnswerTimeLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameName.trim()) {
      setError('Please enter a game name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Ensure user is authenticated
      let token = localStorage.getItem('token');

      if (!token) {
        // Quick signup for DJ
        const authResponse = await apiService.quickJoin(user.username);
        localStorage.setItem('token', authResponse.token);
      }

      const response = await apiService.createGame(gameName, answerTimeLimit);
      onGameCreated(response.game);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">🎵 DJ Control Panel</h1>
            <p className="text-gray-600">Create a new blind test game</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateGame}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Game Name</label>
              <div className="relative">
                <FaMusic className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Friday Night Blind Test"
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">
                Answer Time Limit (seconds)
              </label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={answerTimeLimit}
                  onChange={(e) => setAnswerTimeLimit(parseInt(e.target.value))}
                  min="10"
                  max="60"
                  className="input pl-10"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Players will have {answerTimeLimit} seconds to answer each question
              </p>
            </div>

            <button type="submit" className="btn btn-primary w-full text-lg" disabled={loading}>
              {loading ? 'Creating...' : 'Create Game'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Game will be created with a unique code</li>
              <li>2. QR code will be generated for players to scan</li>
              <li>3. Add questions from Spotify or manually</li>
              <li>4. Start the game and control the flow</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGameScreen;
