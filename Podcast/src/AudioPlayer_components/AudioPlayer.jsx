import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const AudioPlayer = ({ episode, isPlaying, onClose }) => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    // Handle Play button click for audio
    const handleAudioPlay = () => {
        setIsAudioPlaying(true);
    };

    const handleAudioClose = () => {
        setIsAudioPlaying(false);
        onClose();
    };

    return (
        <div>
            <Dialog open={isAudioPlaying} onClose={handleAudioClose}>
                <DialogTitle>Episode Player</DialogTitle>
                <DialogContent>
                    <audio controls>
                        <source src={episode.file} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>

                    <Button onClick={handleAudioClose} color="primary">
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AudioPlayer;
