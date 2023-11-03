import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './GenreCarousel.css';

/**
 * GenreCarousel component for selecting genres and displaying shows.
 */
const GenreCarousel = () => {
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedShow, setSelectedShow] = useState(null); // Added selectedShow state
    const [shows, setShows] = useState([]);
    const [filteredShows, setFilteredShows] = useState([]);
    const dropdownRef = useRef(null); // Ref for the dropdown element

    const genreMap = {
        1: "Personal Growth",
        2: "True Crime and Investigative Journalism",
        3: "History",
        4: "Comedy",
        5: "Entertainment",
        6: "Business",
        7: "Fiction",
        8: "News",
        9: "Kids and Family"
    };

    useEffect(() => {
        // Fetch all shows from the API when the component mounts
        const fetchAllShows = async () => {
            try {
                const response = await fetch('https://podcast-api.netlify.app/shows');
                if (response.ok) {
                    const data = await response.json();
                    setShows(data);
                } else {
                    console.error('Error fetching shows:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching shows:', error);
            }
        };

        fetchAllShows();

        // Add a click event listener to the document to close the dropdown
        document.addEventListener('click', handleDocumentClick);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = (event) => {
        // Check if the click is outside the dropdown
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            // Clicked outside the dropdown, close it
            setSelectedGenre('');
        }
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);

        if (shows.length > 0) {
            const showsForGenre = shows.filter((show) => show.genres.some(genreValue => genreMap[genreValue] === genre));

            setFilteredShows(showsForGenre);
        } else {
            console.log('Shows data is not loaded yet.');
        }
    };

    const openModal = (show) => {
        setSelectedShow(show);
    };

    const closeModal = () => {
        setSelectedShow(null);
    };


    // Function to navigate to the '/selectedShow' page
    const viewDetails = () => {
        navigate('/selectedShow', { state: { selectedShow: show } });
    }

    return (
        <div className="genre-carousel">
            <div className="show-list">
                <h2>{selectedGenre || 'All Genres'}</h2>
                <div ref={dropdownRef}>
                    <select value={selectedGenre} onChange={(e) => handleGenreSelect(e.target.value)}>
                        <option value="">select</option>
                        {Object.values(genreMap).map((genre, index) => (
                            <option key={index} value={genre}>
                                {genre}
                            </option>
                        )
                        )}
                    </select>
                </div>
                <ul>
                    {filteredShows.map((show, index) => (
                        <li key={index} onClick={() => openModal(show)}>
                            {show.title}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedShow && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2 className="show-title">{selectedShow.title}</h2>
                        <img className="show-image" src={selectedShow.image} alt={selectedShow.title} />
                        <p className="show-description">{selectedShow.description}</p>
                        <br />
                        <Link to="/selectedShow" state={{ selectedShow }}>
                            View Details
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenreCarousel;
