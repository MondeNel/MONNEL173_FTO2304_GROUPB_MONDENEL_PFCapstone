import React, { useState } from 'react';
import './GenreCarousel.css';

const genres = [
    "Personal Growth",
    "True Crime and Investigative Journalism",
    "History",
    "Comedy",
    "Entertainment",
    "Business",
    "Fiction",
    "News",
    "Kids and Family"
];

/**
 * GenreCarousel component for selecting genres.
 */
const GenreCarousel = () => {
    const [selectedGenre, setSelectedGenre] = useState('');

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        // Add filtering functionality based on the selected genre.
    };

    return (
        <div className="genre-carousel">

            <div className="genre-buttons">
                {genres.map((genre, index) => (
                    <button
                        key={index}
                        className={selectedGenre === genre ? 'selected' : ''}
                        onClick={() => handleGenreSelect(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GenreCarousel;
