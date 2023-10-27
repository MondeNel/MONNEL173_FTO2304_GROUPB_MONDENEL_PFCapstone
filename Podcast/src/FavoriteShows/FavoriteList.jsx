import React, { useEffect, useState } from 'react';
import './Favorite.css';
import ShowCard from '../Main_components/ShowCard';

import supabase from '../config/supabaseClient';

const FavoriteList = () => {
    const [favoriteShows, setFavoriteShows] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [sortAscending, setSortAscending] = useState(true); // For sorting
    const [showMore, setShowMore] = useState(false); // For showing more

    useEffect(() => {
        // Fetch favorite shows when the component mounts
        fetchFavoriteShows();
    }, []);

    const fetchFavoriteShows = async () => {
        const { data, error } = await supabase
            .from('favorite_shows')
            .select('id, created_at, title, description, seasons, updated, genres, image');

        if (error) {
            console.error('Error fetching favorite shows:', error);
        } else {
            // Parse the "seasons" field from JSON string to array
            const favoriteShows = data.map((show) => ({
                ...show,
                seasons: JSON.parse(show.seasons),
            }));
            setFavoriteShows(favoriteShows);
            setIsDataFetched(true); // Set data fetch flag to true
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

    // Sort the favorite shows based on title
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

            <div className="grid_container">
                {isDataFetched &&
                    visibleFavoriteShows.map((show, index) => (
                        <ShowCard
                            key={index}
                            show={show}
                            image={show.image}
                            updateFavoriteShows={updateFavoriteShows}
                        />
                    ))}
            </div>

            <br />

            <button className='show-more-button' onClick={toggleShowMore}>
                {showMore ? 'Show Less' : 'Show More'}
            </button>

        </div>
    );
};

export default FavoriteList;
