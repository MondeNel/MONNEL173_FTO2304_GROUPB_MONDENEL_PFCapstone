import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import Search from './Search';
import { useNavigate } from 'react-router';

/**
 * Navbar component for the podcast app.
 */
const Navbar = () => {
    const navigate = useNavigate();

    /**
     * Sign out the user and navigate to the sign-up page.
     */
    const signOutUser = () => {
        // Assuming you have a route for the sign-up page, you can navigate the user there.
        navigate('/');
    };

    const navbarStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: 'white',

    };

    return (
        <div className="navbar" style={navbarStyle}>
            <h1>Podcast App</h1>

            <div className="navbar__input">
                <Search />
            </div>

            <div className="dropdown">
                <button className="dropbtn">Menu</button>
                <div className="dropdown-content">
                    <Link to="/favoriteList" className="link-button">Favorite Shows</Link>
                    <Link to="/favoriteEpisode" className="link-button">Favorite Episodes</Link>

                    <button onClick={signOutUser} className="log-out-button">Log Out</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
