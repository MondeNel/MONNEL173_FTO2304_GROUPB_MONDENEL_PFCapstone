import React, { useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './Card.css';

import supabase from '../config/supabaseClient';
import VideoPlayerModal from '../VideoPlayer_components/VideoPlayerModal';


const ShowCard = ({ show, genreMapping, logFavoriteShow, updateFavoriteShows, image }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(''); // Selected SEASON
    const [selectedEpisode, setSelectedEpisode] = useState(''); // Selected EPISODE
    const [isFavorite, setIsFavorite] = useState(false);

    const [showSeasons, setShowSeasons] = useState([]); // To store SEASON data
    const [showEpisodes, setShowEpisodes] = useState([]); // To store EPISODE data

    // Add state to track whether the video is playing
    const [isPlaying, setIsPlaying] = useState(false);

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

                // Log the selected season and its episodes
                console.log('Selected Season:', selectedSeasonData);
                console.log('Episodes:', episodes);
            }
        } else {
            // If no season is selected, clear the episodes
            setShowEpisodes([]);

            // Log that no season is selected
            console.log('No Season Selected');
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

    // Handle the Play button click
    const handlePlay = (episodeFile) => {
        // Open the video player modal with the episode's "file" as the video source
        setIsPlaying(episodeFile);
    }



    const updatedDate = new Date(show.year);
    const year = updatedDate.getFullYear();

    // Step 6: Dropdown for SEASON Selection
    const seasonOptions = showSeasons
        ? showSeasons.map((season, index) => (
            <option key={index} value={`season${index + 1}`}>
                Season {index + 1}
            </option>
        ))
        : null;

    const episodeOptions = showEpisodes
        ? showEpisodes.map((episode, index) => (
            <option key={index} value={`episode${index + 1}`}>
                {episode.title}
            </option>
        ))
        : null;

    const handleEpisodeChange = (event) => {
        setSelectedEpisode(event.target.value);
    };

    return (
        <div className="show__card">
            <img src={show.image} alt={show.title} />
            <h2>{show.title}</h2>

            <div className="show__align">
                <button onClick={openDialog}>Show Details</button>

                {/* Play button */}
                <div className="play-button" onClick={handlePlay}>
                    {isPlaying ? (
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
                    <br />
                    <h3>Number of Seasons: {show.seasons}</h3>

                    <br />
                    <h3>Year: {show.updated}</h3>
                    <br />
                    {show.genres && Array.isArray(show.genres) && show.genres.map((genreId) => (
                        <div key={genreId} className="genre">
                            {genreMapping[genreId] && (
                                <div>
                                    {genreId === 1 && <VideoLibraryIcon />}
                                    {genreId === 2 && <HistoryIcon />}
                                    <span>{genreMapping[genreId]}</span>
                                </div>
                            )}
                        </div>
                    ))}


                    <div className="dropdowns">
                        {/* Step 6: Dropdown for SEASON Selection */}
                        <label htmlFor="season">Select a season:</label>
                        <select name="season" className="season" onChange={handleSeasonChange}>
                            <option value="">Select a season</option>
                            {seasonOptions}
                        </select>

                        {/* Step 7: Dropdown for EPISODE Selection */}
                        {selectedSeason && (
                            <div>
                                <label htmlFor="episode">Select an episode:</label>
                                <select name="episode" className="episode" onChange={handleEpisodeChange}>
                                    <option value="">Select an episode</option>
                                    {episodeOptions}
                                </select>
                            </div>
                        )}
                    </div>

                    <Button onClick={closeDialog} color="primary">
                        Close
                    </Button>
                </DialogContent>
            </Dialog>

            {/* VideoPlayerModal component */}
            <VideoPlayerModal
                videoSource={isPlaying} // Pass the episode's "file" as the video source
                onClose={() => setIsPlaying(false)} // Close the video player modal
                isPlaying={isPlaying} // Control the visibility of the modal
            />


        </div >
    );
};

export default ShowCard;
