import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './Main_components/Home';
import SignUp from './Signup_components/SignUp';
import FavoriteList from './FavoriteShows/FavoriteList';
import SelectedShow from './SelectedShows/SelectedShow';
import FavoriteEpisode from './FavoriteShows/FavoriteEpisode';

/**
 * Functional component representing the main application.
 * This component sets up routing using React Router and defines the base URL as "/app".
 * It renders different components for different routes.
 *
 * @returns {JSX.Element} The JSX element representing the application.
 */
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} /> {/* Renders the SignUp component at the root path. */}
      <Route path="/home" element={<Home />} /> {/* Renders the Home component at /app/home. */}
      <Route path="/favoriteList" element={<FavoriteList />} /> {/* Renders FavoriteList component at /app/favoriteList. */}
      <Route path="/favoriteEpisode" element={<FavoriteEpisode />} /> {/* Renders FavoriteEpisode component at /app/favoriteEpisode. */}
      <Route path="/selectedShow" element={<SelectedShow />} /> {/* Renders SelectedShow component at /app/selectedShow. */}
    </Routes>
  );
};

export default App;
