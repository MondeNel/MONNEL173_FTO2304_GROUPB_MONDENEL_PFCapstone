import React from 'react'

const SearchResultsDialog = ({ show }) => {
    const maxLength = 210; // Adjust this as needed

    return (
        <div className="modal-overlay">
            <div className="selected-show">
                <h2>{show.title}</h2>
                <img src={show.image} alt={show.title} />

                <div className="paragraph__text">
                    <p>
                        {show.description.length > maxLength
                            ? show.description.substring(0, maxLength) + '...'
                            : show.description}
                    </p>
                </div>

                {/* Add your season and episode selection components here */}
                {/* For example: <SeasonSelection show={show} /> */}
                {/* You can create more components as needed. */}
            </div>
        </div>
    );
};

export default SearchResultsDialog