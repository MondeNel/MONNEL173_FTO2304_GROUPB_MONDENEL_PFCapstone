import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar_components/Navbar';

const API_URL = 'https://podcast-api.netlify.app/shows';

const Home = () => {
    const [data, setData] = useState(null);
    const [visibleShows, setVisibleShows] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [sortAscending, setSortAscending] = useState(true);

    const genreMapping = {
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
        // Fetch data when the component mounts
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((result) => {
                setData(result);
                console.log(result); // Log the fetched data
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // Set the number of visible shows based on whether "Show More" is clicked
        const numVisibleShows = showMore ? shows.length : 5;
        const sorted = shows.slice().sort((a, b) => {
            if (sortAscending) {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
        setVisibleShows(sorted.slice(0, numVisibleShows));
    }, [shows, showMore, sortAscending]);

    const toggleShowMore = () => {
        setShowMore((prevShowMore) => !prevShowMore);
    };


    const toggleSortOrder = () => {
        setSortAscending((prevSortAscending) => !prevSortAscending);
    };


    return (
        <div>
            <Navbar />

            <h2>Shows to Listen and Watch</h2>

            <button onClick={toggleSortOrder} className="sort-button">
                Sort by Title {sortAscending ? 'A-Z' : 'Z-A'}
            </button>

            {data ? (
                <div>
                    {/* Display data or any other components here */}
                </div>
            ) : (
                <div>Loading...</div>
            )}

            <button>Log out</button>
        </div>
    );
}

export default Home;
