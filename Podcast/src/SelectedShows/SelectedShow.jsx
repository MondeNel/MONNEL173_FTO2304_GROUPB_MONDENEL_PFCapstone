import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, CardActions, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './SelectedShow.css';
import AudioPlayer from '../AudioPlayer_components/AudioPlayer';

import supabase from '../config/supabaseClient';

const SelectedShow = () => {
    const location = useLocation();
    const selectedShow = location.state?.selectedShow || null;
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [selectedEpisodeAudio, setSelectedEpisodeAudio] = useState('');
    const [favorites, setFavorites] = useState([]); // Track favorite episodes
    const navigate = useNavigate();

    // Define the isFavorite function earlier in the code
    const isFavorite = (episodeTitle) => favorites.includes(episodeTitle);

    const handleSeasonChange = (event) => {
        const selectedSeasonValue = event.target.value;
        setSelectedSeason(selectedSeasonValue);
        // Clear the selected episodes when changing the season
        setSelectedSeasonEpisodes([]);
    };

    const handlePlay = (episodeFile) => {
        setSelectedEpisodeAudio(episodeFile);
        setIsAudioPlaying(true);
    };

    const logFavoriteEpisode = (message) => {
        console.log(message);
        // You can customize this function to log messages as needed.
    };


    const toggleFavoriteEpisode = async (episode, isFavorite) => {
        try {
            if (!isFavorite) {
                logFavoriteEpisode(`Added to favorites: ${episode.title}`);
                const favoriteEpisode = {
                    title: episode.title,
                    description: episode.description,
                    episode: episode.episode,
                    is_favorite: true,
                };

                const { data, error } = await supabase.from('favorite_episodes').upsert([favoriteEpisode]);

                if (error) {
                    console.error('Error adding to favorite episodes:', error);
                } else {
                    console.log('Added to favorite episodes:', data);
                    // You may want to update the local state or trigger a re-render here
                }
            } else {
                logFavoriteEpisode(`Removed from favorites: ${episode.title}`);
            }
        } catch (error) {
            console.error('Error in toggleFavoriteEpisode:', error);
        }
    };




    useEffect(() => {
        // Fetch season data when the selected season changes
        const fetchSeasonData = async () => {
            if (selectedShow && selectedShow.id && selectedSeason) {
                try {
                    const response = await fetch(`https://podcast-api.netlify.app/id/${selectedShow.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        const selectedShowSeasons = data.seasons;
                        const selectedSeasonData = selectedShowSeasons.find((season) => season.title === selectedSeason);
                        setSelectedSeasonEpisodes(selectedSeasonData ? selectedSeasonData.episodes : []);
                    } else {
                        console.error('Error fetching show details:', response.status, response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching show details:', error);
                }
            }
        };

        fetchSeasonData();
    }, [selectedShow, selectedSeason]);

    const goBackToHome = () => {
        navigate('/home');
    };

    return (
        <Container className="selected-show-container">
            {selectedShow ? (
                <div>
                    <Typography variant="h2">{selectedShow.title}</Typography>
                    <img
                        className="selected-show-image"
                        src={selectedShow.image}
                        alt={selectedShow.title}
                    />
                    <Typography className="selected-show-description">{selectedShow.description}</Typography>

                    {/* Display the number of seasons in a dropdown */}
                    <div className="dropdowns">
                        <label htmlFor="season">Select a season:</label>
                        <select
                            name="season"
                            className="season"
                            onChange={handleSeasonChange}
                            value={selectedSeason}
                        >
                            <option value="">Select a season</option>
                            {Array.from({ length: selectedShow.seasons }, (_, index) => (
                                <option key={index} value={`Season ${index + 1}`}>
                                    {`Season ${index + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Display the episodes in a Netflix-style layout */}
                    {selectedSeason && (
                        <div className="episode-list">
                            {selectedSeasonEpisodes.map((episode, index) => (
                                <Card key={index} className="card">
                                    <CardContent>
                                        <Typography variant="h5">{`Episode ${index + 1}: ${episode.title}`}</Typography>
                                        <Typography>{episode.description}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button className="play_button" onClick={() => handlePlay(episode.file)}>Play</Button>
                                        <IconButton
                                            style={{ color: isFavorite ? 'red' : 'grey' }}
                                            className={`favorite-icon ${isFavorite(episode.title) ? 'active' : ''}`}
                                            onClick={() => toggleFavoriteEpisode(episode, isFavorite(episode.title))}
                                        >
                                            {isFavorite(episode.title) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>


                                    </CardActions>
                                </Card>
                            )
                            )}
                        </div>
                    )}

                    <Button className='go_back' onClick={goBackToHome}>Go back</Button>

                    <AudioPlayer
                        episode={{ file: selectedEpisodeAudio }}
                        isPlaying={isAudioPlaying}
                        onClose={() => setIsAudioPlaying(false)}
                    />
                </div>
            ) : (
                <Typography>No show selected.</Typography>
            )}
        </Container>
    );
};

export default SelectedShow;
