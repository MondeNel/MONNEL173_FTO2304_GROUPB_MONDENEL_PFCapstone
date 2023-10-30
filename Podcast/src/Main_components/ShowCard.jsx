import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './Card.css';

import supabase from '../config/supabaseClient';
import AudioPlayer from '../AudioPlayer_components/AudioPlayer';

/**
 * ShowCard component displays information about a show and allows interactions with it.
 *
 * @param {Object} props - The component's properties.
 * @param {Object} props.show - The show data to be displayed.
 * @param {Object} props.genreMapping - A mapping of genre IDs to their names.
 * @param {Function} props.logFavoriteShow - Callback to log favorite show actions.
 * @param {Function} props.updateFavoriteShows - Callback to update the list of favorite shows.
 * @returns {JSX.Element} The ShowCard component JSX.
 */
const ShowCard = ({ show, genreMapping, logFavoriteShow, updateFavoriteShows }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(''); // Selected SEASON
    const [selectedEpisode, setSelectedEpisode] = useState(''); // Selected EPISODE
    const [isFavorite, setIsFavorite] = useState(false);

    const [showSeasons, setShowSeasons] = useState([]); // To store SEASON data
    const [showEpisodes, setShowEpisodes] = useState([]); // To store EPISODE data

    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [selectedEpisodeAudio, setSelectedEpisodeAudio] = useState('');

    const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
    const [selectedEpisodeFile, setSelectedEpisodeFile] = useState('');

    // Handle the Play button click
    const handlePlay = (episodeFile) => {
        setSelectedEpisodeFile(episodeFile);
        setIsEpisodeModalOpen(true);
    }

    const openDialog = async () => {
        try {
            const response = await fetch(`https://podcast-api.netlify.app/id/${show.id}`);
            if (response.ok) {
                const data = await response.json();

                // Extract SEASON data from the API response
                const { seasons } = data;

                // Log the SEASONS
                console.log('SEASONS:', seasons);

                // Set the SEASON data in state
                setShowSeasons(seasons);
            } else {
                console.error('Error fetching show details:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching show details:', error);
        }
        setDialogOpen(true);
    }

    // Handle SEASON Selection
    const handleSeasonChange = (event) => {
        const selectedSeasonValue = event.target.value;
        setSelectedSeason(selectedSeasonValue);

        // Extract EPISODE data from the selected season
        if (selectedSeasonValue) {
            const selectedSeasonData = showSeasons.find((season) => season.title === selectedSeasonValue);
            if (selectedSeasonData) {
                const episodes = selectedSeasonData.episodes;
                setShowEpisodes(episodes);
            } else {
                // If no season is selected, clear the episodes
                setShowEpisodes([]);
            }
        } else {
            // If no season is selected, clear the episodes
            setShowEpisodes([]);
        }
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const toggleFavorite = async (event) => {
        setIsFavorite(!isFavorite);
        if (!isFavorite) {
            logFavoriteShow(`Added to favorites: ${show.title}`);
            const favoriteShow = {
                title: show.title,
                description: show.description,
                seasons: show.seasons,
                updated: show.updated,
                genres: show.genres.map((genreId) => genreMapping[genreId]),
                image: show.image,
                added_at: new Date(),
            };

            supabase.from('favorite_shows').upsert([favoriteShow]).then(({ data, error }) => {
                if (error) {
                    console.error('Error adding to favorite shows:', error);
                } else {
                    console.log('Added to favorite shows:', data);
                    if (updateFavoriteShows) {
                        updateFavoriteShows([...favoriteShows, favoriteShow]);
                    }
                }
            });
        } else {
            logFavoriteShow(`Removed from favorites: ${show.title}`);
        }
    }

    /**
     * Format a date string into a human-readable date.
     *
     * @param {string} dateString - The date string to format.
     * @returns {string} The formatted date.
     */
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
        <div className="show__card">
            <h2>{show.title}</h2>
            <img src={show.image.toString()} alt={show.title} />
            <p>Number of Seasons: {show.seasons}</p>
            <p>Last Updated: {formatDate(show.updated)}</p>

            <div className="genre">
                {show.genres && Array.isArray(show.genres) && show.genres.map((genreId) => (
                    <div key={genreId}>
                        {genreMapping[genreId] && (
                            <span>{genreMapping[genreId]}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="show__align">
                <button onClick={openDialog}>Show Details</button>

                <div className="play-button" onClick={handlePlay}>
                    {isAudioPlaying ? ( // Change isPlaying to isAudioPlaying
                        <span>Playing</span>
                    ) : (
                        <PlayArrowIcon style={{ fontSize: 35, color: 'red' }} />
                    )}
                </div>

                <div className="favorite-icon" onClick={toggleFavorite}>
                    <FavoriteIcon style={{ color: isFavorite ? 'red' : 'grey' }} />
                </div>
            </div>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{show.title}</DialogTitle>
                <DialogContent>
                    <p>{show.description}</p>
                    <div className="dropdowns">
                        {/* Dropdown for SEASON Selection */}
                        <label htmlFor="season">Select a season:</label>
                        <select name="season" className="season" onChange={handleSeasonChange}>
                            <option value="">Select a season</option>
                            {showSeasons.map((season, index) => (
                                <option key={index} value={season.title}>
                                    {season.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Display episodes for the selected season */}
                    {showEpisodes.length > 0 && (
                        <div className="episode-list">
                            <h3>Episodes:</h3>
                            <ul>
                                {showEpisodes.map((episode, index) => (
                                    <li key={index}>
                                        <button onClick={() => handlePlay(episode.file)}>{episode.title}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Button onClick={closeDialog} color="primary">
                        Close
                    </Button>
                </DialogContent>
            </Dialog>

            {/* AudioPlayer component */}
            <AudioPlayer
                episode={{ file: selectedEpisodeAudio }}
                isPlaying={isAudioPlaying}
                onClose={() => setIsAudioPlaying(false)}
            />

            <Dialog open={isEpisodeModalOpen} onClose={() => setIsEpisodeModalOpen(false)}>
                <DialogTitle>Episode Player</DialogTitle>
                <DialogContent>
                    <audio controls>
                        <source src={selectedEpisodeFile} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <Button onClick={() => setIsEpisodeModalOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ShowCard;
