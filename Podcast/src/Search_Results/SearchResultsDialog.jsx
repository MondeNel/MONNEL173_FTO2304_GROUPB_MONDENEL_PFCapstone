import React from 'react';
import './Search.css'

const SearchResultsDialog = ({ show }) => {
    const maxLength = 420; // Adjust this as needed

    const seasons = Array.from({ length: show.seasons }, (_, index) => index + 1);

    return (
        <div className="modal-overlay">
            <div className="selected-show">
                <h2 className='title-show'>{show.title}</h2>
                <img src={show.image} alt={show.title} />

                <div className="paragraph__text">
                    <p>
                        {show.description.length > maxLength
                            ? show.description.substring(0, maxLength) + '...'
                            : show.description}
                    </p>
                </div>

                <div className="dropdown">
                    <button className="dropbtn">Season</button>
                    <div className="dropdown-content">
                        {seasons.map((season) => (
                            <a key={season} href="#">
                                Season {season}
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SearchResultsDialog;
