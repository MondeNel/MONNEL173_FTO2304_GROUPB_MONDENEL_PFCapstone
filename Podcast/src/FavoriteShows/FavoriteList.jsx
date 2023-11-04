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
    const [showMore, setShowMore] = useState(false);
    const [sortOption, setSortOption] = useState('dateAsc'); // Default sorting option
    const [sortTitleOption, setSortTitleOption] = useState('titleAsc'); // Default sorting option


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

    const sortFavoriteShowsByTitle = (option) => {
        let sorted;

        if (option === 'titleAsc') {
            sorted = favoriteShows.slice().sort((a, b) => a.title.localeCompare(b.title));
        } else if (option === 'titleDesc') {
            sorted = favoriteShows.slice().sort((a, b) => b.title.localeCompare(a.title));
        }

        updateFavoriteShows(sorted);
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

    /**
 * Sort favorite shows by date in ascending or descending order and log the results.
 */
    const sortFavoriteShows = () => {
        if (sortOption === 'dateAsc') {
            const sorted = favoriteShows.slice().sort((a, b) => new Date(a.updated) - new Date(b.updated));
            updateFavoriteShows(sorted);
            console.log('Sorted by date in ascending order:', sorted);
        } else if (sortOption === 'dateDesc') {
            const sorted = favoriteShows.slice().sort((a, b) => new Date(b.updated) - new Date(a.updated));
            updateFavoriteShows(sorted);
            console.log('Sorted by date in descending order:', sorted);
        }
    };

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
            <br />
            <h4>Sort shows based on dates</h4>
            <br />
            <select
                value={sortOption}
                onChange={(e) => {
                    setSortOption(e.target.value);
                    sortFavoriteShows(); // Call the sorting function when the user selects an option
                }}
                className="sort-dropdown"
            >
                <option value="dateAsc">New to Old</option>
                <option value="dateDesc">Old to New</option>
            </select>

            <select
                value={sortTitleOption}
                onChange={(e) => {
                    setSortTitleOption(e.target.value);
                    sortFavoriteShowsByTitle(e.target.value);
                }}
                className="sort-dropdown"
            >
                <option value="titleAsc">Sort by Title A-Z</option>
                <option value="titleDesc">Sort by Title Z-A</option>
            </select>



            <br />

            {loading ? ( // Render loading spinner while loading is true
                <div className="loading-spinner-container">
                    <CircularProgress size={50} />
                </div>
            ) : (
                <div className="grid_container">
                    {favoriteShows.map((show, index) => (
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
