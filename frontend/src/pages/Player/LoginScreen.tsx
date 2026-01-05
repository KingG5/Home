import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import apiService from '../../services/api';

interface LoginScreenProps {
  onLogin: (user: { id: string; username: string }, token: string) => void;
  initialGameCode: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, initialGameCode }) => {
  const [mode, setMode] = useState<'quick' | 'login' | 'signup'>('quick');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.quickJoin(username);
      onLogin(response.user, response.token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(username, password || undefined);
      onLogin(response.user, response.token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.signup(username, email || undefined, password || undefined);
      onLogin(response.user, response.token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-primary mb-2">🎵 Join the Game!</h1>
            {initialGameCode && (
              <p className="text-gray-600">
                Game Code: <span className="font-bold">{initialGameCode}</span>
              </p>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('quick')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                mode === 'quick'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Quick Join
            </button>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                mode === 'login'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                mode === 'signup'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Quick Join Form */}
          {mode === 'quick' && (
            <form onSubmit={handleQuickJoin}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Choose a username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Joining...' : 'Join Game'}
              </button>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Quick join creates a temporary account
              </p>
            </form>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Username</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Password (optional)
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="input pl-10"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Username</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Email (optional)
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input pl-10"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Password (optional)
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password"
                    className="input pl-10"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
