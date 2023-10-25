import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Search from './Search';

const Navbar = () => {
    const navbarStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: 'white', // Change the background color if needed
        padding: '10px 10px 0 10px',
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
                    <Link to="/favoriteList">Favorite Shows</Link> {/* Link to the "Favorite Shows" page */}
                    <Link to="/login">Log Out</Link> {/* Link to the "Log Out" page */}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
