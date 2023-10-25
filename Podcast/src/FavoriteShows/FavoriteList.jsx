import React, { useEffect, useState } from 'react';
import ShowCard from '../Main_components/ShowCard';

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

        fetchFavoriteShows(); // Call the fetchFavoriteShows function directly

    }, []);

    // In FavoriteList.js
    const updateFavoriteShows = (updatedShows) => {
        setFavoriteShows(updatedShows);
    };

    // Pass this function down as a prop to ShowCard
    <ShowCard key={index} show={show} updateFavoriteShows={updateFavoriteShows} />

    // In ShowCard.js, after successfully adding/removing from favorites, call the function to update the state
    const toggleFavorite = async () => {

        updateFavoriteShows(newFavoriteShows);
    };



    return (
        <div>
            <h2>Favorite Shows</h2>
            {favoriteShows.map((show, index) => (
                <ShowCard key={index} show={show} />
            ))}
        </div>
    );
};

export default FavoriteList;
