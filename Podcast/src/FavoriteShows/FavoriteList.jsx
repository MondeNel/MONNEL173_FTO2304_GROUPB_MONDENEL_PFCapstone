import React, { useState, useEffect } from 'react';
import './Favorite.css';
import ShowCard from '../Main_components/ShowCard';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';

import supabase from '../config/supabaseClient';

/**
 * FavoriteList component for displaying a list of favorite shows.
 *
 * @returns {JSX.Element} The FavoriteList component JSX.
 */
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

    /**
     * Fetches the user's favorite shows from the database and updates the state.
     */
    const fetchFavoriteShows = async () => {
        const { data, error } = await supabase
            .from('favorite_shows')
            .select('id, created_at, title, description, seasons, updated, genres, image, added_at');

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

    /**
     * Updates the list of favorite shows.
     *
     * @param {Object[]} updatedShows - The updated list of favorite shows.
     */
    const updateFavoriteShows = (updatedShows) => {
        setFavoriteShows(updatedShows);
    };

    /**
     * Toggles the sort order of favorite shows.
     */
    const toggleSortOrder = () => {
        setSortAscending((prevSortAscending) => !prevSortAscending);
    };

    /**
     * Toggles the display of more or fewer favorite shows.
     */
    const toggleShowMore = () => {
        setShowMore((prevShowMore) => !prevShowMore);
    };

    /**
     * Handles the removal of a favorite show from the list and the database.
     *
     * @param {string} showId - The ID of the show to be removed.
     */
    const handleRemoveFavoriteShow = async (showId) => {
        // Remove the show from the database
        const { data, error } = await supabase
            .from('favorite_shows')
            .delete()
            .eq('id', showId);

        if (error) {
            console.error('Error removing favorite show:', error);
        } else {
            // Filter out the removed show from the state
            const updatedShows = favoriteShows.filter((show) => show.id !== showId);
            updateFavoriteShows(updatedShows);
        }
    };

    const sortedFavoriteShows = favoriteShows.slice().sort((a, b) => {
        if (sortAscending) {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });

    const visibleFavoriteShows = showMore ? sortedFavoriteShows : sortedFavoriteShows.slice(0, 5);

    /**
     * Formats a date and time string into a readable format.
     *
     * @param {string} dateTimeString - The date and time string to format.
     * @returns {string} Formatted date and time string.
     */
    function formatDateTime(dateTimeString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Date(dateTimeString).toLocaleDateString(undefined, options);
    }

    return (
        <div>
            <h1 className='title'>Favorite Shows</h1>

            <button className='sort-button' onClick={toggleSortOrder}>
                {sortAscending ? 'Sort Descending' : 'Sort Ascending'}
            </button>

            <br />

            {loading ? ( // Render loading spinner while loading is true
                <div className="loading-spinner-container">
                    <CircularProgress size={50} />
                </div>
            ) : (
                <div className="grid_container">
                    {visibleFavoriteShows.map((show, index) => (
                        <div key={show.id}>
                            <ShowCard
                                show={show}
                                image={show.image}
                                updateFavoriteShows={updateFavoriteShows}
                            />
                            <DeleteIcon
                                onClick={() => handleRemoveFavoriteShow(show.id)}
                                className="delete-icon"
                            />
                            <p className='date_time'>Added on: {formatDateTime(show.added_at)}</p>

                        </div>
                    ))}
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
