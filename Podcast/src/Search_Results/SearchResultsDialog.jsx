import React from 'react';
import './Search.css';

/**
 * Component for displaying search results in a modal dialog.
 *
 * @param {Object} props - The component's properties.
 * @param {boolean} props.show - Indicates whether the dialog should be displayed.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @returns {JSX.Element} The SearchResultsDialog component JSX.
 */
const SearchResultsDialog = ({ show, onClose }) => {
    // Maximum length for displaying the description
    const maxLength = 420;

    return (
        <div className="modal-overlay">
            <div className="selected-show">
                {/* Title of the show */}
                <h2 className="title-show">{show.title}</h2>

                {/* Show image */}
                <img src={show.image} alt={show.title} />

                <div className="paragraph__text">
                    <p>
                        {/* Displaying a truncated description if it exceeds maxLength */}
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
