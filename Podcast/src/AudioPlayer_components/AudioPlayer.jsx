import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
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
            <Dialog open={isAudioPlaying} onClose={handleAudioClose}>
                <DialogTitle>Episode Player</DialogTitle>
                <DialogContent>
                    <div className="audio-player">
                        <audio controls>
                            <source src={episode.file} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        <button onClick={handleAudioPlay}>Play</button>
                        <Button onClick={handleAudioClose} variant="contained" color="primary">
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AudioPlayer;
