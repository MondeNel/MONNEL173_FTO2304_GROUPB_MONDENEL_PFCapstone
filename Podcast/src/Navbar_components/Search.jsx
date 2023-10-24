import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShowCard from '../Card/ShowCard';
import './Navbar.css';

const API_URL = 'https://podcast-api.netlify.app/shows';

function Search() {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // State to control the display of the overlay dialog
    const [selectedShow, setSelectedShow] = useState(null);

    useEffect(() => {
        if (searchInput) {
            setLoading(true);

            fetch(API_URL)
                .then((response) => response.json())
                .then((data) => {
                    // Filter the shows that contain the character(s) typed by the user
                    const filteredShows = data.filter((show) =>
                        show.title.toLowerCase().includes(searchInput.toLowerCase())
                    );

                    setSearchResults(filteredShows);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        } else {
            setSearchResults([]);
        }
    }, [searchInput]);

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Function to open the dialog with selected show information
    const showOverlayDialog = (show) => {
        setSelectedShow(show);
    };

    // Function to close the dialog
    const closeOverlayDialog = () => {
        setSelectedShow(null);
    };

    return (
        <div className="search_bar">
            <div className="search_bar_input">
                <SearchIcon className="search__icon" />
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchInput}
                    onChange={handleInputChange}
                />
            </div>

            {loading && <p>Loading...</p>}
            {!loading && searchResults.length === 0 && searchInput !== '' && (
                <p>No results found.</p>
            )}
            <div className="autocomplete-results">
                {searchResults.map((result) => (
                    <div
                        key={result.id}
                        onClick={() => showOverlayDialog(result)}
                        className="autocomplete-result"
                    >
                        {result.title}
                    </div>
                ))}
            </div>

            {/* ShowCard dialog */}
            {selectedShow && (
                <ShowCard
                    show={selectedShow}
                    onCloseDialog={closeOverlayDialog}
                />
            )}
        </div>
    );
}

export default Search;
