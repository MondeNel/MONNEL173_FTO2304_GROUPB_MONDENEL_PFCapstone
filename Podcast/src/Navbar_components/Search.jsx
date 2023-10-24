import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './Navbar.css';

const API_URL = 'https://podcast-api.netlify.app/shows';

const Searchbar = () => {
    const [input, setInput] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handleDocumentClick = (event) => {
        if (!document.querySelector('.input__wrapper').contains(event.target)) {
            setShowResults(false);
        }
    };

    const fetchData = (value) => {
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw Error(`Fetch error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                const filteredShows = data.filter((show) => {
                    return show.title.toLowerCase().includes(value.toLowerCase());
                });

                setFilteredData(filteredShows);
                setShowResults(true);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    let searchTimeout;

    const handleChange = (value) => {
        setInput(value);

        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            if (value.trim() !== '') {
                fetchData(value);
            } else {
                setFilteredData([]);
                setShowResults(false);
            }
        }, 100);
    };

    const handleResultClick = (title) => {
        const show = filteredData.find((show) => show.title === title);
        if (show) {
            setSelectedShow(show);
            setShowResults(false);
        }
    };

    const maxLength = 210;

    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
        const episodesForSeason = selectedShow.episodes.filter(
            (episode) => episode.season === season
        );
        setSelectedSeasonEpisodes(episodesForSeason);
    };

    return (
        <div className="input__wrapper">
            <SearchIcon className='search__icon' />
            <input
                type="text"
                className="input"
                placeholder="Type to search..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
            <div className={`result__box ${showResults ? 'show' : ''}`}>
                <ul className="result__list">
                    {filteredData.map((show) => (
                        <li key={show.id} className="result" onClick={() => handleResultClick(show.title)}>
                            {show.title}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedShow && (
                <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
                    <div className="selected-show">
                        <h2>{selectedShow.title}</h2>
                        <img src={selectedShow.image} alt={selectedShow.title} />

                        <div className="selectedShow__button">
                            <button className="selected__show__button1" onClick={openModal}>
                                View
                            </button>
                            <button className="selected__show__button2" onClick={closeModal}>
                                Close
                            </button>
                        </div>

                        <div className="paragraph__text">
                            <p>
                                {selectedShow.description.length > maxLength
                                    ? selectedShow.description.substring(0, maxLength) + '...'
                                    : selectedShow.description}
                            </p>
                        </div>

                        {selectedShow.seasons && selectedShow.seasons.length > 0 && (
                            <div>
                                <label>Select Season:</label>
                                <select
                                    value={selectedSeason}
                                    onChange={(e) => handleSeasonChange(e.target.value)}
                                >
                                    <option value="">All Seasons</option>
                                    {selectedShow.seasons.map((season) => (
                                        <option key={season} value={season}>
                                            Season {season}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {selectedSeasonEpisodes.length > 0 && (
                            <div className="episodes">
                                {selectedSeasonEpisodes.map((episode) => (
                                    <div key={episode.id}>
                                        <span>{episode.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Searchbar;