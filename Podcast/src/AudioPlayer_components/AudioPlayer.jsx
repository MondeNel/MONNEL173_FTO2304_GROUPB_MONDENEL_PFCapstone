import React, { useState } from 'react';
import './AudioPlayer.css';

/**
 * AudioPlayer component for playing audio episodes.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.episode - The episode data to be played.
 * @param {boolean} props.isPlaying - Indicates if the audio is currently playing.
 * @param {Function} props.onClose - Function to close the audio player dialog.
 * @returns {JSX.Element} The AudioPlayer component JSX.
 */

const AudioPlayer = ({ episode, isPlaying, onClose }) => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    /**
     * Handles the Play button click for audio playback.
     */
    const handleAudioPlay = () => {
        setIsAudioPlaying(true);
    };

    /**
     * Handles closing the audio player dialog and stopping audio playback.
     */
    const handleAudioClose = () => {
        setIsAudioPlaying(false);
        onClose();
    };

    return (
        <div>

            <div className="audio-player">
                <audio controls>
                    <source src={episode.file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>

        </div>
    );
};

export default AudioPlayer;
