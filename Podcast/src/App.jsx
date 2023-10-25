import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './Main_components/Home';
import SignUp from './Signup_components/SignUp';
import Login from './Signup_components/Login';
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
      <Route path="/" element={<Home />} /> {/* Renders the Home component at the root path. */}
      <Route path="/signup" element={<SignUp />} /> {/* Renders the SignUp component at /app/signup. */}
      <Route path="/login" element={<Login />} /> {/* Renders the Login component at /app/login. */}
      <Route path="/favoriteList" element={<FavoriteList />} /> {/* Renders the Search component at /app/search. */}
    </Routes>

  );
};

export default App;
