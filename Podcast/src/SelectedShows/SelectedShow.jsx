import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, CardActions, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './SelectedShow.css';
import AudioPlayer from '../AudioPlayer_components/AudioPlayer';

const SelectedShow = () => {
    const location = useLocation();
    const selectedShow = location.state?.selectedShow || null;
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [selectedEpisodeAudio, setSelectedEpisodeAudio] = useState('');
    const [favorites, setFavorites] = useState([]); // Track favorite episodes
    const navigate = useNavigate();

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

    const toggleFavorite = (episodeTitle) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(episodeTitle)) {
                return prevFavorites.filter((title) => title !== episodeTitle);
            } else {
                return [...prevFavorites, episodeTitle];
            }
        });
    };

    const isFavorite = (episodeTitle) => favorites.includes(episodeTitle);

    const goBackToHome = () => {
        navigate('/home');
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
                                            className={`favorite-icon ${isFavorite(episode.title) ? 'active' : ''}`}
                                            onClick={() => toggleFavorite(episode.title)}
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
