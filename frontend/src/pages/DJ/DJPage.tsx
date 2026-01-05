import React, { useState, useEffect } from 'react';
import CreateGameScreen from './CreateGameScreen';
import ControlPanel from './ControlPanel';
import socketService from '../../services/socket';
import { Game } from '../../types';

const DJPage: React.FC = () => {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      // For DJ, require authentication
      const username = prompt('Enter DJ username:');
      if (username) {
        const djUser = { id: 'dj-' + Date.now(), username };
        setUser(djUser);
        localStorage.setItem('user', JSON.stringify(djUser));
      }
    } else {
      setUser(JSON.parse(savedUser));
    }

    // Connect socket
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleGameCreated = (game: Game) => {
    setCurrentGame(game);
  };

  const handleBackToCreate = () => {
    setCurrentGame(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!currentGame) {
    return <CreateGameScreen user={user} onGameCreated={handleGameCreated} />;
  }

  return <ControlPanel game={currentGame} user={user} onBack={handleBackToCreate} />;
};

export default DJPage;
