import React, { useState, useEffect } from 'react';
import ShowCard from './ShowCard';
import './Content.css'
import Navbar from '../Navbar_components/Navbar';

const Home = ({ selectedShow }) => {
    const [shows, setShows] = useState([]);
    const [visibleShows, setVisibleShows] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [sortAscending, setSortAscending] = useState(true);


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

    useEffect(() => {
        const apiUrl = 'https://podcast-api.netlify.app/shows';
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw Error(`Fetch error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setShows(data);
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


    const addFavoriteShow = (show) => {
        // Retrieve the list of favorite shows from localStorage or your data source
        const favoriteShows = JSON.parse(localStorage.getItem('favoriteShows')) || [];

        const isFavorite = favoriteShows.some((favoriteShow) => favoriteShow.id === show.id);

        if (isFavorite) {
            // Remove the show from favorites
            const updatedFavorites = favoriteShows.filter((favoriteShow) => favoriteShow.id !== show.id);
            localStorage.setItem('favoriteShows', JSON.stringify(updatedFavorites));
            console.log("Removed from favorites:", show.title);
        } else {
            // Add the show to favorites
            favoriteShows.push(show);
            localStorage.setItem('favoriteShows', JSON.stringify(favoriteShows));
            console.log("Added to favorites:", show.title);
        }
    };




    return (
        <div className="container">


            <div className="main__content">

                <Navbar />

                <h2>Shows to Listen and Watch</h2>

                <button onClick={toggleSortOrder} className="sort-button">
                    Sort by Title {sortAscending ? 'A-Z' : 'Z-A'}
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
                    {visibleShows.map((show, index) => (
                        <ShowCard
                            key={index}
                            show={show}
                            genreMapping={genreMapping}
                            onToggleFavorite={() => addFavoriteShow(show)}
                        />
                    ))}
                </div>

                <button onClick={toggleShowMore} className="show-more-button">
                    {showMore ? 'Show Less' : 'Show More'}
                </button>
            </div>
        </div>
    );
};

export default Home;