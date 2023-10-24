import React, { useState, useEffect } from 'react';

const API_URL = 'https://podcast-api.netlify.app/shows';

function Search() {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchInput) {
            setLoading(true);

            fetch(`${API_URL}?q=${searchInput}`)
                .then((response) => response.json())
                .then((data) => {
                    setSearchResults(data);
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

    return (
        <div>
            <input
                type="text"
                placeholder="Search by title..."
                value={searchInput}
                onChange={handleInputChange}
            />
            {loading && <p>Loading...</p>}
            {!loading && searchResults.length === 0 && searchInput !== '' && (
                <p>No results found.</p>
            )}
            <ul>
                {searchResults.map((result) => (
                    <li key={result.id}>{result.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default Search;
