import React, { useState, useEffect } from 'react';
import './Favorite.css';
import ShowCard from '../Main_components/ShowCard';
import CircularProgress from '@mui/material/CircularProgress';

import supabase from '../config/supabaseClient';

const FavoriteList = () => {
    const [favoriteShows, setFavoriteShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortAscending, setSortAscending] = useState(true);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            fetchFavoriteShows();
        }, 1000); // Delay for 1 second before loading data
    }, []);

    const fetchFavoriteShows = async () => {
        const { data, error } = await supabase
            .from('favorite_shows')
            .select('id, created_at, title, description, seasons, updated, genres, image');

        if (error) {
            console.error('Error fetching favorite shows:', error);
        } else {
            const favoriteShows = data.map((show) => ({
                ...show,
                seasons: JSON.parse(show.seasons),
            }));
            setFavoriteShows(favoriteShows);
            setLoading(false);
        }
    };

    const updateFavoriteShows = (updatedShows) => {
        setFavoriteShows(updatedShows);
    };

    const toggleSortOrder = () => {
        setSortAscending((prevSortAscending) => !prevSortAscending);
    };

    const toggleShowMore = () => {
        setShowMore((prevShowMore) => !prevShowMore);
    };

    const sortedFavoriteShows = favoriteShows.slice().sort((a, b) => {
        if (sortAscending) {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });

    const visibleFavoriteShows = showMore ? sortedFavoriteShows : sortedFavoriteShows.slice(0, 5);

    return (
        <div>
            <h1 className='title'>Favorite Shows</h1>

            <button className='sort-button' onClick={toggleSortOrder}>
                {sortAscending ? 'Sort Descending' : 'Sort Ascending'}
            </button>

            <br />

            {loading ? ( // Render loading spinner while loading is true
                <div className="loading-spinner-container">
                    <CircularProgress size={80} />
                </div>
            ) : (
                <div className="grid_container">
                    {visibleFavoriteShows.map((show, index) => (
                        <ShowCard
                            key={index}
                            show={show}
                            image={show.image}
                            updateFavoriteShows={updateFavoriteShows}
                        />
                    ))} {/* Add this closing parenthesis */}
                </div>
            )}

            <br />

            <button className='show-more-button' onClick={toggleShowMore}>
                {showMore ? 'Show Less' : 'Show More'}
            </button>
        </div>
    );
};

export default FavoriteList;
