import React, { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';

/**
 * EpisodePlayer component displays a list of last played episodes fetched from Supabase.
 *
 * @returns {JSX.Element} The EpisodePlayer component JSX.
 */
const EpisodePlayer = () => {
    const [lastPlayedEpisodes, setLastPlayedEpisodes] = useState([]);

    useEffect(() => {
        // Define an async function to fetch data from the Supabase table
        const fetchLastPlayedEpisodes = async () => {
            try {
                const { data, error } = await supabase.from('last_listened_episodes').select('*');
                if (error) {
                    console.error('Error fetching data:', error);
                } else {
                    // Set the fetched data to the state
                    setLastPlayedEpisodes(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the fetch function when the component mounts
        fetchLastPlayedEpisodes();
    }, []);

    return (
        <div>
            <h2>Last Played Episodes</h2>
            <ul>
                {lastPlayedEpisodes.map((episode) => (
                    <li key={episode.id}>
                        {/* Display episode information, e.g., title, date, etc. */}
                        <p>Episode ID: {episode.id}</p>
                        <p>Date: {episode.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EpisodePlayer;
