import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
    const [openModal, setOpenModal] = useState(false);
    const [userDecision, setUserDecision] = useState(false);



    const [playMessage, setPlayMessage] = useState('');

    const navigate = useNavigate();

    const goBackToHome = () => {
        navigate('/home');
    };


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
        const fetchSeasonData = async () => {
            if (selectedShow && selectedShow.id && selectedSeason) {
                try {
                    const response = await fetch(`https://podcast-api.netlify.app/id/${selectedShow.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        const selectedShowSeasons = data.seasons;
                        const allEpisodes = selectedShowSeasons
                            .map((season) => season.episodes)
                            .flat(); // Flatten the episodes from all seasons into a single array
                        setSelectedSeasonEpisodes(allEpisodes);
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

    useEffect(() => {
        if (userDecision) {
            if (userDecision === true) {
                // User clicked 'Yes,' navigate to the home page
                goBackToHome();
            }
        }
    }, [userDecision]);


    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    const handleAudioClose = () => {
        setIsAudioPlaying(false);
        setPlayMessage('');
        onClose();
    };

    const handleAudioControlsPlay = () => {
        setPlayMessage('Audio is currently playing.');
    };

    const openConfirmationModal = () => {
        setOpenModal(true);
    };

    const closeConfirmationModal = (decision) => {
        setUserDecision(decision);
        setOpenModal(false);
    };



    return (
        <Container className="selected-show-container">
            <Button className="go_back" onClick={openConfirmationModal}>Go back</Button>

            <Dialog open={openModal} onClose={() => closeConfirmationModal(false)}>
                <DialogTitle>Confirm Leaving</DialogTitle>
                <DialogContent>
                    <DialogContentText className='dialog_text'>
                        Are you sure you want to leave this page?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => closeConfirmationModal(false)} className='dialog_button'>
                        No
                    </Button>
                    <Button onClick={() => closeConfirmationModal(true)} className='dialog_button'>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>


            <br />
            {selectedShow ? (
                <div>
                    <Typography variant="h5">{selectedShow.title}</Typography>
                    <img
                        className="selected-show-image"
                        src={selectedShow.image}
                        alt={selectedShow.title}
                    />
                    <Typography className="selected-show-description">{selectedShow.description}</Typography>

                    <br />

                    {/* Display the number of seasons as a number */}
                    <h3>Seasons : {selectedShow.seasons}</h3>

                    <br />

                    {/* Display the number of seasons in a dropdown */}
                    <div className="dropdowns">
                        <label htmlFor="season" className='select'>Select a season:</label>
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

                    {selectedSeasonEpisodes.map((episode, index) => (
                        <Card key={index} className="card">
                            <CardContent>
                                <Typography className='episode-title'>{`Episode ${index + 1}`}</Typography>
                                <br />
                                <Typography>{episode.title}</Typography>
                                <Typography>{episode.description}</Typography>

                                <br />

                                <Typography>{`Date: ${formatDate(selectedShow.updated)}`}</Typography>


                                <IconButton
                                    style={{ color: isFavorite(episode.title) ? 'red' : 'grey' }}
                                    className={`favorite-icon ${isFavorite(episode.title) ? 'active' : ''}`}
                                    onClick={() => toggleFavoriteEpisode(episode, isFavorite(episode.title))}
                                >
                                    {isFavorite(episode.title) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>

                                <AudioPlayer
                                    episode={{
                                        file: "https://podcast-api.netlify.app/placeholder-audio.mp3",
                                        episodeNumber: episode.episode,
                                    }}
                                    isPlaying={isAudioPlaying}
                                    onPlay={handleAudioControlsPlay} // Pass the callback to display the play message
                                    onClose={() => setIsAudioPlaying(false)}
                                />

                            </CardContent>
                        </Card>
                    ))}

                </div>
            ) : (
                <Typography>No show selected.</Typography>
            )}
        </Container>
    );
};

export default SelectedShow;
