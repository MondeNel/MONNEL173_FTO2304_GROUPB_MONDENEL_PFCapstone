import React, { useEffect, useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import './Card.css';

import supabase from '../config/supabaseClient';

const ShowCard = ({ show, genreMapping, logFavoriteShow }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            const { data, error } = await supabase
                .from('shows')
                .select('title')
                .eq('title', show.title);

            if (error) {
                setFetchError('Could not fetch favorite shows');
                console.error(error);
            }

            if (data) {
                setIsFavorite(data.length > 0);
            }
        };

        fetchFavorites();
    }, [show.title]);

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const toggleFavorite = async () => {
        if (isFavorite) {
            // Remove the show from favorites
            const { error } = await supabase
                .from('shows')
                .delete()
                .eq('title', show.title);

            if (error) {
                console.error('Error removing from favorites:', error);
            } else {
                setIsFavorite(false);
                logFavoriteShow(`Removed from favorites: ${show.title}`);
            }
        } else {
            // Add the show to favorites
            const { error } = await supabase
                .from('shows')
                .upsert([
                    {
                        title: show.title,
                        description: show.description,
                        // Add other fields you want to store
                    },
                ]);

            if (error) {
                console.error('Error adding to favorites:', error);
            } else {
                setIsFavorite(true);
                logFavoriteShow(`Added to favorites: ${show.title}`);
            }
        }
    };

    const updatedDate = new Date(show.updated);
    const year = updatedDate.getFullYear();

    const seasonOptions = show.seasons
        ? Array.from({ length: show.seasons }, (_, index) => (
            <option key={index} value={`season${index + 1}`}>
                Season {index + 1}
            </option>
        ))
        : null;

    const episodeOptions = show.episodes
        ? show.episodes.map((episode, index) => (
            <option key={index} value={`episode${index + 1}`}>
                Episode {index + 1}
            </option>
        ))
        : null;

    const handleSeasonChange = (event) => {
        setSelectedSeason(event.target.value);
    };

    return (
        <div className={`show__card ${isFavorite ? 'favorite' : ''}`}>
            <img src={show.image} alt={show.title} />
            <h2>{show.title}</h2>

            <div className='show__align'>
                <button onClick={openDialog}>Show Details</button>

                <div
                    className={`favorite-icon ${isFavorite ? 'favorite' : ''}`}
                    onClick={toggleFavorite}
                >
                    {isFavorite ? (
                        <FavoriteIcon style={{ color: 'red' }} />
                    ) : (
                        <FavoriteIcon style={{ color: 'grey' }} />
                    )}
                </div>
            </div>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{show.title}</DialogTitle>
                <DialogContent>
                    <p>{show.description}</p>

                    <br />

                    <h3>Number of Seasons: {show.seasons || 'N/A'}</h3>

                    <br />

                    <h3>Year: {year}</h3>

                    <br />

                    <div className="genres">
                        {show.genres.map((genreId) => (
                            <div key={genreId} className="genre">
                                {genreMapping[genreId] && (
                                    <>
                                        {genreId === 1 && <VideoLibraryIcon />}
                                        {genreId === 2 && <HistoryIcon />}
                                        <span>{genreMapping[genreId]}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="dropdowns">
                        <label htmlFor="season">Select a season:</label>
                        <select name="season" className="season" onChange={handleSeasonChange}>
                            <option value="">Select a season</option>
                            {seasonOptions}
                        </select>

                        {selectedSeason && (
                            <div>
                                <label htmlFor="episode">Select an episode:</label>
                                <select name="episode" className="episode">
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
        </div>
    );
}

export default ShowCard;
