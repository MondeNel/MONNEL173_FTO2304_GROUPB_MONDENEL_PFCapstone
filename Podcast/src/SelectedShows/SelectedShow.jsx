import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SelectedShow.css'; // Import a CSS file for styling
import AudioPlayer from '../AudioPlayer_components/AudioPlayer';

const SelectedShow = ({ show }) => {
    console.log(show);
    const location = useLocation();
    const selectedShow = location.state?.selectedShow || null;
    const [selectedSeason, setSelectedSeason] = useState('');
    const [selectedSeasonEpisodes, setSelectedSeasonEpisodes] = useState([]);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [selectedEpisodeAudio, setSelectedEpisodeAudio] = useState('');
    const navigate = useNavigate();

    const handleSeasonChange = (event) => {
        const selectedSeasonValue = event.target.value;
        setSelectedSeason(selectedSeasonValue);
        // Clear the selected episodes when changing the season
        setSelectedSeasonEpisodes([]);
    };

    const handlePlay = (episodeFile) => {
        setSelectedEpisodeAudio(episodeFile);
        setIsAudioPlaying(true);
    };

    const goBackToHome = () => {
        navigate('/home');
    };

    useEffect(() => {
        // Fetch season data when the selected season changes
        const fetchSeasonData = async () => {
            if (selectedShow && selectedShow.id && selectedSeason) {
                try {
                    const response = await fetch(`https://podcast-api.netlify.app/id/${selectedShow.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        const selectedShowSeasons = data.seasons;
                        const selectedSeasonData = selectedShowSeasons.find((season) => season.title === selectedSeason);
                        setSelectedSeasonEpisodes(selectedSeasonData ? selectedSeasonData.episodes : []);
                    } else {
                        console.error('Error fetching show details:', response.status, response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching show details:', error);
                }
            }
        };

        fetchSeasonData();
    }, [selectedShow, selectedSeason]);

    console.log('selectedSeasonEpisodes:', selectedSeasonEpisodes);

    console.log('selectedSeason:', selectedSeason);

    console.log('selectedShow.id:', selectedShow.id);

    return (
        <div className="selected-show-container">
            {selectedShow ? (
                <div>
                    <h2>{selectedShow.title}</h2>
                    <img
                        className="selected-show-image"
                        src={selectedShow.image}
                        alt={selectedShow.title}
                    />
                    <p className="selected-show-description">{selectedShow.description}</p>

                    {/* Display the number of seasons in a dropdown */}
                    <div className="dropdowns">
                        <label htmlFor="season">Select a season:</label>
                        <select
                            name="season"
                            className="season"
                            onChange={handleSeasonChange}
                            value={selectedSeason}
                        >
                            <option value="">Select a season</option>
                            {/* Map through the number of seasons */}
                            {Array.from({ length: selectedShow.seasons }, (_, index) => (
                                <option key={index} value={`Season ${index + 1}`}>
                                    {`Season ${index + 1}`}
                                </option>
                            )
                            )}
                        </select>
                    </div>

                    {/* Dropdown for EPISODE Selection (conditional rendering) */}
                    {selectedSeason && (
                        <div className="episode-dropdown">
                            <label htmlFor="episode">Select an episode:</label>
                            <select
                                name="episode"
                                className="episode"
                                value={selectedEpisodeAudio}
                                onChange={(event) => handlePlay(event.target.value)}
                            >
                                <option value="">Select an episode</option>
                                {selectedSeasonEpisodes.map((episode, index) => (
                                    <option key={index} value={episode.file}>
                                        {episode.title}
                                    </option>
                                )
                                )}

                            </select>
                            {/* Display episode images and titles in a column */}
                            {selectedSeasonEpisodes.map((episode, index) => (
                                <div className="episode-entry" key={index}>
                                    <img className="episode-image" src={episode.image} alt={episode.title} />
                                    <span className="episode-title">{episode.title}</span>
                                </div>
                            )
                            )}
                        </div>
                    )}

                    <button onClick={goBackToHome}>Go back</button>

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
