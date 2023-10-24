import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SearchResultsDialog from '../Search_Results/SearchResultsDialog';
import './Navbar.css';

const API_URL = 'https://podcast-api.netlify.app/shows';

const Searchbar = () => {
    const [input, setInput] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);

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

export default Searchbar;