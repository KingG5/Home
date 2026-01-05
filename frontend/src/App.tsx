import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PlayerPage from './pages/Player/PlayerPage';
import DJPage from './pages/DJ/DJPage';
import DisplayPage from './pages/Display/DisplayPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayerPage />} />
        <Route path="/dj" element={<DJPage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
