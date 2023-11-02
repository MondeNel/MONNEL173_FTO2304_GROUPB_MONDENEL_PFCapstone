import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SelectedShow.css'; // Import a CSS file for styling

import AudioPlayer from '../AudioPlayer_components/AudioPlayer';

const SelectedShow = () => {
    // Access the location to get the state
    const location = useLocation();
    const selectedShow = location.state?.selectedShow || null;

    // Define a state for the selected season
    const [selectedSeason, setSelectedSeason] = useState('');
    // Define a state to store the selected season's episodes
    const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);

    // Define a state to control the visibility of the episode player
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [selectedEpisodeAudio, setSelectedEpisodeAudio] = useState('');

    // Use the useNavigate hook to get the navigation function
    const navigate = useNavigate();


    // Define the handleSeasonChange function
    const handleSeasonChange = (event) => {
        const selectedSeasonValue = event.target.value;
        setSelectedSeason(selectedSeasonValue);

        if (selectedShow && Array.isArray(selectedShow.seasons)) {
            const selectedSeasonData = selectedShow.seasons.find((season) => season.title === selectedSeasonValue);
            setSelectedSeasonEpisodes(selectedSeasonData ? selectedSeasonData.episodes : []);
        }
    };

    // Function to handle the play button click and open the episode player
    const handlePlay = (episodeFile) => {
        setSelectedEpisodeAudio(episodeFile);
        setIsAudioPlaying(true);
    };

    // Function to navigate back to the '/home' page
    const goBackToHome = () => {
        navigate('/home');
    };


    return (
        <div className="selected-show-container">
            {selectedShow ? (
                <div>
                    <h2>{selectedShow.title}</h2>
                    <img
                        className="selected-show-image" // Apply a class for styling
                        src={selectedShow.image}
                        alt={selectedShow.title}
                    />
                    <p className="selected-show-description">{selectedShow.description}</p>
                    <h2>Number of Seasons: {selectedShow.seasons && selectedShow.seasons.length}</h2>

                    <div className="dropdowns">
                        {/* Dropdown for SEASON Selection */}
                        <label htmlFor="season">Select a season:</label>
                        <select
                            name="season"
                            className="season"
                            onChange={handleSeasonChange}
                            value={selectedSeason}
                        >
                            <option value="">Select a season</option>
                            {selectedShow.seasons && Array.isArray(selectedShow.seasons) && selectedShow.seasons.map((season, index) => (
                                <option key={index} value={season.title}>
                                    {season.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Display episodes for the selected season */}
                    {selectedSeasonEpisodes.length > 0 && (
                        <div className="episode-list">
                            <h3>{selectedSeason} Episodes:</h3>
                            <ul>
                                {selectedSeasonEpisodes.map((episode, index) => (
                                    <li key={index}>
                                        <button onClick={() => handlePlay(episode.file)}>{episode.title}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* "Go back" button to navigate to the '/home' page */}
                    <button onClick={goBackToHome}>Go back</button>

                    {/* AudioPlayer component */}
                    <AudioPlayer
                        episode={{ file: selectedEpisodeAudio }}
                        isPlaying={isAudioPlaying}
                        onClose={() => setIsAudioPlaying(false)}
                    />
                </div>

            ) : (
                <p>No show selected.</p>
            )}
        </div>
    );
};

export default SelectedShow;
