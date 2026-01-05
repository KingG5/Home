import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaGamepad, FaTv } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🎵 Blind Test Bar App
          </h1>
          <p className="text-xl text-white opacity-90">
            Interactive music quiz for your bar - Play, compete, and have fun!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Player Card */}
          <Link to="/play" className="block">
            <div className="card hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer text-center">
              <div className="text-6xl mb-4 text-primary">
                <FaGamepad className="mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Player</h2>
              <p className="text-gray-600 mb-4">
                Join a game, answer questions, and compete for the top spot!
              </p>
              <div className="btn btn-primary w-full">
                Join Game
              </div>
            </div>
          </Link>

          {/* DJ Card */}
          <Link to="/dj" className="block">
            <div className="card hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer text-center">
              <div className="text-6xl mb-4 text-secondary">
                <FaMusic className="mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-3">DJ Panel</h2>
              <p className="text-gray-600 mb-4">
                Create games, manage questions, and control the flow!
              </p>
              <div className="btn btn-secondary w-full">
                DJ Dashboard
              </div>
            </div>
          </Link>

          {/* Display Card */}
          <Link to="/display" className="block">
            <div className="card hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer text-center">
              <div className="text-6xl mb-4 text-success">
                <FaTv className="mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Display Screen</h2>
              <p className="text-gray-600 mb-4">
                Show live leaderboard and questions on the big screen!
              </p>
              <div className="btn btn-success w-full">
                Display Mode
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="card inline-block">
            <h3 className="text-lg font-semibold mb-2">How it works</h3>
            <ol className="text-left space-y-2 text-gray-700">
              <li>1. DJ creates a game and generates a QR code</li>
              <li>2. Players scan the QR code or enter the game code</li>
              <li>3. DJ plays tracks and players guess the answers</li>
              <li>4. Points are awarded for correct and fast answers</li>
              <li>5. Winner takes the crown! 👑</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
