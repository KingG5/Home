import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import GameScreen from './GameScreen';
import socketService from '../../services/socket';

const PlayerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gameCode, setGameCode] = useState(searchParams.get('code') || '');
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    // Connect socket
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleLogin = (userData: { id: string; username: string }, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!isAuthenticated || !user) {
    return <LoginScreen onLogin={handleLogin} initialGameCode={gameCode} />;
  }

  return <GameScreen user={user} gameCode={gameCode} onLogout={handleLogout} />;
};

export default PlayerPage;
