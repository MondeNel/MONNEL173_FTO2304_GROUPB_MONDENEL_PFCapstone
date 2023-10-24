import React, { useState } from 'react';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './Card.css';

const ShowCard = ({ show, genreMapping, onToggleFavorite, logFavoriteShow }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(''); // State to store the selected season

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const toggleFavorite = () => {
        setIsFavorite((prevIsFavorite) => !prevIsFavorite);
        onToggleFavorite(show);
    };

    const handleLogFavorite = () => {
        logFavoriteShow(show);
    };

    const updatedDate = new Date(show.updated);
    const year = updatedDate.getFullYear();

    // Generate the dropdown options for seasons
    const seasonOptions = show.seasons
        ? Array.from({ length: show.seasons }, (_, index) => (
            <option key={index} value={`season${index + 1}`}>
                Season {index + 1}
            </option>
        ))
        : null;

    // Generate the dropdown options for episodes
    const episodeOptions = show.episodes
        ? show.episodes.map((episode, index) => (
            <option key={index} value={`episode${index + 1}`}>
                Episode {index + 1}
            </option>
        ))
        : null;

    // Event handler for selecting a season
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

            {isDialogOpen && (
                <div className="dialog">
                    <h3>{show.title}</h3>
                    <p>{show.description}</p>
                    <p>Number of Seasons: {show.seasons || 'N/A'}</p>
                    <p>Year: {year}</p>
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
                        {/* Dropdown for seasons */}
                        <label htmlFor="season">Select a season:</label>
                        <select name="season" className="season" onChange={handleSeasonChange}>
                            <option value="">Select a season</option>
                            {seasonOptions}
                        </select>

                        {/* Dropdown for episodes */}
                        {selectedSeason && (
                            <div>
                                <label htmlFor="episode">Select an episode:</label>
                                <select name="episode" className="episode">
                                    {episodeOptions}
                                </select>
                            </div>
                        )}
                    </div>


                    <button onClick={closeDialog}>Close</button>
                </div>
            )}
        </div>
    );
}

export default ShowCard;