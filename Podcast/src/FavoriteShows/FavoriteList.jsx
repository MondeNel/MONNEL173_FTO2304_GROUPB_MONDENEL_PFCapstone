import React, { useEffect, useState } from 'react';
import './Favorite.css'
import ShowCard from '../Main_components/ShowCard';

import supabase from '../config/supabaseClient';

const FavoriteList = () => {
    const [favoriteShows, setFavoriteShows] = useState([]);

    useEffect(() => {
        const fetchFavoriteShows = async () => {
            const { data, error } = await supabase
                .from('favorite_shows')
                .select('*');
            if (error) {
                console.error('Error fetching favorite shows:', error);
            } else {
                setFavoriteShows(data);
            }
        };

        fetchFavoriteShows();

    }, []);

    const updateFavoriteShows = (updatedShows) => {
        setFavoriteShows(updatedShows);
    };

    return (
        <div>
            <h1>Favorite Shows</h1>
            {favoriteShows.map((show, index) => (
                <ShowCard key={index} show={show} updateFavoriteShows={updateFavoriteShows} />
            ))}

        </div>
    );
};

export default FavoriteList;
