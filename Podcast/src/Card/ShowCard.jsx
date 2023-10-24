import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './Card.css';

const ShowCard = ({ show, onToggleFavorite }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

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

    return (
        <div className={`show-card ${isFavorite ? 'favorite' : ''}`}>
            <div className="card-content">
                <img src={show.image} alt={show.title} />
                <h2>{show.title}</h2>
                <button onClick={openDialog}>Show Details</button>

                <div className={`favorite-icon ${isFavorite ? 'favorite' : ''}`} onClick={toggleFavorite}>
                    {isFavorite ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon style={{ color: 'grey' }} />}
                </div>
            </div>

            {isDialogOpen && (
                <div className="dialog">
                    <h3>{show.title}</h3>
                    <p>{show.description}</p>
                    <p>Number of Seasons: {show.seasons || 'N/A'}</p>
                    <p>Year: {show.updated}</p>
                    {/* Add genres and other show information as needed */}
                    <button onClick={closeDialog}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ShowCard;
