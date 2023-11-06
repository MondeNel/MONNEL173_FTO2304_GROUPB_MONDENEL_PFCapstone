import React, { useState, useEffect } from 'react';
import ShowCard from '../Main_components/ShowCard';
import './Carousel.css'; // Create a CSS file for styling

/**
 * CarouselCard component displays a sliding carousel of show cards.
 *
 * @returns {JSX.Element} The CarouselCard component JSX.
 */
const CarouselCard = () => {
    const [shows, setShows] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Slice the shows array to determine the visible shows in the carousel
    const visibleShows = shows.slice(currentIndex, currentIndex + 4);

    // Define genreMapping object to map genre IDs to their names
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

    // Define the logFavoriteShow function if it's used in ShowCard
    const logFavoriteShow = (message) => {
        // Implement your logic for logging favorite shows
        console.log(message);
    };

    /**
     * Function to navigate to the next show in the carousel.
     */
    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % shows.length);
    };

    /**
     * Function to navigate to the previous show in the carousel.
     */
    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + shows.length) % shows.length);
    };

    useEffect(() => {
        // Fetch show data from the API
        fetch('https://podcast-api.netlify.app/shows')
            .then(response => response.json())
            .then(data => {
                setShows(data); // Set the fetched data in the 'shows' state
            })
            .catch(error => {
                console.error('Error fetching show data:', error);
            });
    }, []); // Ensure this effect runs only once

    return (
        <div className="carousel">
            <h2>Shows you might be interested</h2>
            <br />

            <div className="grid__container">
                {/* Map through the shows and display ShowCard components */}
                {visibleShows.map((show, index) => (
                    <ShowCard
                        key={index}
                        show={show}
                        genreMapping={genreMapping}
                        logFavoriteShow={logFavoriteShow}
                    />
                ))}
            </div>

            <div className="buttons">
                <button className="carousel-button prev" onClick={prevSlide}>
                    Previous
                </button>
                <button className="carousel-button next top-right" onClick={nextSlide}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default CarouselCard;
