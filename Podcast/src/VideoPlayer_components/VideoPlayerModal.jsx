import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const VideoPlayerModal = ({ videoSource, onClose, isPlaying }) => {
    return (
        <Dialog open={isPlaying} onClose={onClose}>
            <DialogContent>
                <video controls width="100%" height="auto">
                    <source src={videoSource} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </DialogContent>
        </Dialog>
    );
};

export default VideoPlayerModal;
