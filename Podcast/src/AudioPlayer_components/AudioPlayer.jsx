import React, { useState, useRef } from 'react';
import './AudioPlayer.css';
import supabase from '../config/supabaseClient';

const AudioPlayer = ({ episode, isPlaying, onClose, onPlay }) => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [playMessage, setPlayMessage] = useState('');

    const audioRef = useRef(null);

    const handleAudioPlay = async () => {
        setIsAudioPlaying(true);
        audioRef.current.play(); // Play the audio
        setPlayMessage('Audio playing');

        // Replace 'episodeNumber' with the actual episode number or identifier.
        const episodeNumber = episode.episodeNumber;

        // Update the 'last_listened_episodes' table in Supabase with the episode number and the current date.
        try {
            const { data, error } = await supabase.from('last_listened_episodes').upsert([
                {
                    episode: episodeNumber,
                    date: new Date(),
                },
            ]);

            if (error) {
                console.error('Error updating last listened episodes:', error);
            } else {
                console.log('Updated last listened episodes:', data);
            }
        } catch (error) {
            console.error('Error in handleAudioPlay:', error);
        }

        if (onPlay) {
            onPlay(); // Call the onPlay function to display the message
        }
    };

    const handleAudioStop = () => {
        setIsAudioPlaying(false);
        audioRef.current.pause(); // Pause the audio
        setPlayMessage('Audio paused');
    };

    const handleAudioClose = () => {
        setIsAudioPlaying(false);
        audioRef.current.pause(); // Pause the audio
        setPlayMessage('');
        onClose();
    };

    return (
        <div>
            <div className="audio-player">
                <button onClick={handleAudioPlay} className="play-button">
                    Play
                </button>
                <button onClick={handleAudioStop} className="stop-button">
                    Stop
                </button>
                <p>{playMessage}</p>
                <audio controls ref={audioRef}>
                    <source src={episode.file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
};

export default AudioPlayer;
