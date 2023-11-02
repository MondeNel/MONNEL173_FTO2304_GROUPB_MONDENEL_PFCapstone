import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const [selectedShow, setSelectedShow] = useState([]);

    // Use the useNavigate hook to get the navigation function
    const navigate = useNavigate();


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

    // Function to navigate to the '/selectedShow' page
    const viewDetails = () => {
        navigate('/selectedShow', { state: { selectedShow: show } });
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
                <button onClick={viewDetails}>View Details</button>


                <div className="favorite-icon" onClick={toggleFavorite}>
                    <FavoriteIcon style={{ color: isFavorite ? 'red' : 'grey' }} />
                </div>
            </div>

        </div>
    );
};

export default ShowCard;
