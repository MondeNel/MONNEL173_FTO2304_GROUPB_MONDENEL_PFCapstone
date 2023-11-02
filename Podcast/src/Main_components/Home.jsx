import React, { useState, useEffect } from 'react';
import ShowCard from './ShowCard';
import './Content.css';
import Navbar from '../Header_components/Navbar';
import GenreCarousel from '../GenreCarousel_component/GenreCarousel'
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Home component for displaying a list of shows and their details.
 *
 * @param {Object} props - The component's properties.
 * @param {Object} props.selectedShow - The selected show to display additional details.
 * @returns {JSX.Element} The Home component JSX.
 */
const Home = ({ selectedShow }) => {
    const [shows, setShows] = useState([]);
    const [visibleShows, setVisibleShows] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [sortAscending, setSortAscending] = useState(true);
    const [loading, setLoading] = useState(true);

    // Define the mapping between GENRE ids and titles
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

    // Step 1: Fetch Data with Fetch API
    useEffect(() => {
        const apiUrl = 'https://podcast-api.netlify.app/shows';

        // Simulate loading for 2 seconds
        const loadingTimeout = setTimeout(() => {
            fetch(apiUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    setShows(data);
                    setLoading(false); // Set loading to false when data is fetched
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false); // Set loading to false on error
                });
        }, 4000);

        // Clear the timeout if the component unmounts before the timeout completes
        return () => clearTimeout(loadingTimeout);
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

    const sortShowsByDate = () => {
        const sorted = shows.slice().sort((a, b) => {
            // Parse and format the dates, then compare them
            const formattedDateA = formatDate(a.date);
            const formattedDateB = formatDate(b.date);

            if (sortAscending) {
                return formattedDateA.localeCompare(formattedDateB); // Ascending order
            } else {
                return formattedDateB.localeCompare(formattedDateA); // Descending order
            }
        });

        setShows(sorted);
    };



    const logFavoriteShow = (message) => {
        console.log(message);
    };

    return (
        <div className="container">
            {loading ? ( // Display loading spinner while loading
                <div className="loading-container">
                    <CircularProgress />
                </div>
            ) : (
                <div className="main__content">
                    <Navbar />

                    <GenreCarousel />

                    <br />

                    <h2>Shows to Listen </h2>
                    <button onClick={toggleSortOrder} className="sort-button">
                        Sort by Title {sortAscending ? 'A-Z' : 'Z-A'}
                    </button>
                    <button onClick={sortShowsByDate} className="sort-button">
                        Sort by Date {sortAscending ? 'Ascending' : 'Descending'}
                    </button>
                    {selectedShow && (
                        <div className="selected-show">
                            <h2>Selected Show</h2>
                            <h3>{selectedShow.title}</h3>
                            <img src={selectedShow.image} alt={selectedShow.title} />
                            <p>{selectedShow.description}</p>
                        </div>
                    )}
                    <div className="grid__container">
                        {/* Step 3: Map through the shows and display ShowCard components */}
                        {visibleShows.map((show, index) => (
                            <ShowCard
                                key={index}
                                show={show}
                                genreMapping={genreMapping}
                                logFavoriteShow={logFavoriteShow}
                            />
                        )
                        )}
                    </div>
                    <button onClick={toggleShowMore} className="show-more-button">
                        {showMore ? 'Show Less' : 'Show More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
