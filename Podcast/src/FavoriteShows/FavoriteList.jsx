import React, { useEffect, useState } from 'react';
import './Favorite.css';
import ShowCard from '../Main_components/ShowCard';

import supabase from '../config/supabaseClient';

const FavoriteList = () => {
    const [favoriteShows, setFavoriteShows] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

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

    return (
        <div>
            <h1 className='title'>Favorite Shows</h1>
            <div className="grid_container">
                {isDataFetched &&
                    favoriteShows.map((show, index) => (
                        <ShowCard
                            key={index}
                            show={show}
                            image={show.image}
                            updateFavoriteShows={updateFavoriteShows}
                        />
                    ))}
            </div>
        </div>
    );
};

export default FavoriteList;
