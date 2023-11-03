import React, { useState, useEffect } from 'react';
import './Favorite.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CircularProgress from '@mui/material/CircularProgress';

import supabase from '../config/supabaseClient';

const FavoriteEpisode = (props) => {
    const { selectedSeasonEpisodes } = props;
    const [loading, setLoading] = useState(true);
    const [favoriteEpisodes, setFavoriteEpisodes] = useState([]); // Add state for favorite episodes

    useEffect(() => {
        setTimeout(() => {
            fetchFavoriteEpisodes();
        }, 1000);
    }, []);

    const fetchFavoriteEpisodes = async () => {
        const { data, error } = await supabase
            .from('favorite_episodes')
            .select('id, created_at, title, episode, is_favorite');

        if (error) {
            console.error('Error fetching favorite episodes:', error);
        } else {
            setFavoriteEpisodes(data);
            setLoading(false);
        }
    };

    const toggleFavorite = async (episodeId) => {
        // Find the episode with the given ID in the favoriteEpisodes array
        const episode = favoriteEpisodes.find((ep) => ep.id === episodeId);

        if (episode) {
            const isFavorite = !episode.is_favorite; // Toggle the favorite status

            // Log the episode title and its favorite status
            console.log(`Episode "${episode.title}" is now ${isFavorite ? 'favorited' : 'unfavorited'}`);

            // Update the favorite status in the local state
            const updatedFavoriteEpisodes = favoriteEpisodes.map((ep) => {
                if (ep.id === episodeId) {
                    return { ...ep, is_favorite: isFavorite };
                }
                return ep;
            });
            setFavoriteEpisodes(updatedFavoriteEpisodes);

            // Update the favorite status in the Supabase database
            const { data, error } = await supabase
                .from('favorite_episodes')
                .update({ is_favorite: isFavorite })
                .eq('id', episodeId);

            if (error) {
                console.error('Error updating favorite status:', error);
            }
        }
    };

    return (
        <div>
            {/* Rest of your component code */}
            {loading ? (
                <div className="loading-spinner-container">
                    <CircularProgress size={50} />
                </div>
            ) : (
                <div className="grid_container">
                    {selectedSeasonEpisodes.map((episode, index) => (
                        <div key={episode.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">{`Episode ${index + 1}: ${episode.title}`}</Typography>
                                    <Typography>{episode.description}</Typography>
                                </CardContent>
                                <IconButton
                                    className={`favorite-icon ${episode.is_favorite ? 'active' : ''}`}
                                    onClick={() => toggleFavorite(episode.id)}
                                >
                                    {episode.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </Card>
                        </div>
                    )
                    )}
                </div>
            )}
            {/* Rest of your component code */}
        </div>
    );
};

export default FavoriteEpisode;
