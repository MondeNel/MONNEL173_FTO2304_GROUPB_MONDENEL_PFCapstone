import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './Main_components/Home';
import SignUp from './Signup_components/SignUp';
import FavoriteList from './FavoriteShows/FavoriteList';


/**
 * Functional component representing the main application.
 * This component sets up routing using React Router and defines the base URL as "/app".
 * It renders a single route at the root path.
 * @returns {JSX.Element} The JSX element representing the application.
 */
const App = () => {
  return (


    <Routes>
      <Route path="/" element={<SignUp />} /> {/* Renders the Home component at the root path. */}

      <Route path="/home" element={<Home />} /> {/* Renders the SignUp component at /app/signup. */}
      <Route path="/favoriteList" element={<FavoriteList />} /> {/* Renders the Search component at /app/search. */}
    </Routes>

  );
};

export default App;
