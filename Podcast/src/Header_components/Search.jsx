import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SearchResultsDialog from '../Search_Results/SearchResultsDialog';
import './Navbar.css';

const API_URL = 'https://podcast-api.netlify.app/shows';

/**
 * Search component for searching and displaying search results.
 *
 * @returns {JSX.Element} The Search component JSX.
 */
const Search = () => {
    const [input, setInput] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

    /**
     * Opens the results dialog when a search result is clicked.
     *
     * @param {Object} show - The selected show data.
     */
    const openResultsDialog = (show) => {
        setSelectedShow(show);
        setShowResults(false);
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    /**
     * Handles clicks outside the input wrapper to close the results dialog.
     *
     * @param {Event} event - The click event.
     */
    const handleDocumentClick = (event) => {
        if (!document.querySelector('.input__wrapper').contains(event.target)) {
            setShowResults(false);
        }
    };

    /**
     * Fetches data based on the search value and sets the filtered data.
     *
     * @param {string} value - The search value.
     */
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

    /**
     * Handles input changes, triggers search, and sets a timeout.
     *
     * @param {string} value - The input value.
     */
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
                        <li key={show.id} className="result" onClick={() => openResultsDialog(show)}>
                            {show.title}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedShow && (
                <SearchResultsDialog show={selectedShow} onClose={() => setSelectedShow(null)} />
            )}
        </div>
    );
};

export default Search;
