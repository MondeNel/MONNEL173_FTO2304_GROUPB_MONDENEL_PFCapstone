import React from 'react';
import './Search.css';

const SearchResultsDialog = ({ show, onClose }) => {
    const maxLength = 420;

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


                {/* Close the modal with the "Close" button */}
                <div className="close-button">
                    <button className="close-button__button" onClick={onClose}>Close</button>
                </div>

            </div>

        </div>
    );
};

export default SearchResultsDialog;
