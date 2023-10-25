import React, { useEffect, useState } from 'react';
import './Favorite.css';
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
            <h3 className='title'>Favorite Shows</h3>
            <div className="grid_container">
                {favoriteShows.map((show, index) => (
                    <ShowCard key={index} show={show} image={show.image} updateFavoriteShows={updateFavoriteShows} />
                ))}

            </div>
        </div>
    );
};

export default FavoriteList;
