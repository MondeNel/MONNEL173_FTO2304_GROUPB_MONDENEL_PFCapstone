import React from 'react';
import './Navbar.css';

import { Switch } from '@mui/material';
import Search from './Search';

const Navbar = ({ isDarkModePreferred, toggleTheme }) => {
    const themeColors = {
        day: {
            dark: '10, 10, 20',
            light: '255, 255, 255',
        },
        night: {
            dark: '18, 18, 18',
            light: '12, 12, 12',
        }
    };

    const theme = isDarkModePreferred ? 'night' : 'day';

    const themeStyle = {
        backgroundColor: `rgba(${themeColors[theme].light}, 1)`,
        color: isDarkModePreferred ? 'white' : `rgba(${themeColors[theme].dark}, 1)`
    };

    const navbarStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: isDarkModePreferred ? 'black' : 'white',
        padding: '10px 10px 0 10px',
    };

    return (
        <div className="theme" style={themeStyle}>
            <div className="navbar" style={navbarStyle}>
                <h1>Podcast App</h1>

                <div className="navbar__input">
                    <Search />
                </div>

                <div className="navbar__icons">
                    <Switch
                        inputProps={{ 'aria-label': 'Toggle theme' }}
                        onChange={toggleTheme}
                        checked={isDarkModePreferred}
                        color="primary"
                    />

                </div>
            </div>
        </div>
    );
};

export default Navbar;
