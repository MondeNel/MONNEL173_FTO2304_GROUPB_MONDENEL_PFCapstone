import React from 'react';
import './Search.css';

const SearchResultsDialog = ({ show, onClose }) => {
    const maxLength = 420; // Adjust this as needed

    const seasons = Array.from({ length: show.seasons }, (_, index) => index + 1);

    // Assuming show.episodes is an array of episodes for all seasons
    const episodes = show.episodes || [];

    return (
        <div className="modal-overlay">
            <div className="selected-show">
                <h2 className="title-show">{show.title}</h2>
                <img src={show.image} alt={show.title} />

                <div className="paragraph__text">
                    <p>
                        {show.description.length > maxLength
                            ? show.description.substring(0, maxLength) + '...'
                            : show.description}
                    </p>
                </div>

                <div className="dropdown">
                    <button className="dropbtn">Seasons</button>
                    <div className="dropdown-content">
                        {seasons.map((season) => (
                            <a key={season} href="#">
                                Season {season}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="dropdown">
                    <button className="dropbtn">Episodes</button>
                    <div className="dropdown-content">
                        {episodes.map((episode) => (
                            <a key={episode.id} href="#">
                                {episode.title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Close the modal with the "Close" button */}
            <div className="close-button">
                <button className="close-button__button" onClick={onClose}>Close</button>
            </div>

            <div className="episodes-list">

                <ul>
                    {episodes.map((episode) => (
                        <li key={episode.id}>{episode.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SearchResultsDialog;
