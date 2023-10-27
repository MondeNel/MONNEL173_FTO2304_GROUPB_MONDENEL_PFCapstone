import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import Search from './Search';

import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router';

const Navbar = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getUserData() {
            const { data, error } = await supabase.auth.user();
            if (data) {
                console.log(data);
                setUser(data);
            }
        }
        getUserData();
    }, []);

    const signOutUser = async () => {
        await supabase.auth.signOut();
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
        padding: '10px 10px 0 10px',
    };

    return (
        <div className="navbar" style={navbarStyle}>
            {/* replace the h1 Podcast with the provided code */}
            <h1>Podcast App</h1>

            <div className="navbar__input">
                <Search />
            </div>

            <div className="dropdown">
                <button className="dropbtn">Menu</button>
                <div className="dropdown-content">
                    <Link to="/favoriteList" className="link-button">Favorite Shows</Link>
                    <button onClick={signOutUser} className="log-out-button">Log Out</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
