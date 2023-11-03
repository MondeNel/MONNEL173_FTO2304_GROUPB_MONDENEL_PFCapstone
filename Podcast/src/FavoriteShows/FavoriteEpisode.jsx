import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import supabase from '../config/supabaseClient';
import AudioPlayer from '../AudioPlayer_components/AudioPlayer'; // Import the AudioPlayer component

const FavoriteEpisode = () => {
    const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
    const [selectedEpisodeAudio, setSelectedEpisodeAudio] = useState('');

    // Handle the Play button click
    const handlePlay = (episodeFile) => {
        // Set the selected episode's audio file URL to the provided link
        setSelectedEpisodeAudio("https://podcast-api.netlify.app/placeholder-audio.mp3");
        setIsEpisodeModalOpen(true);
    }


    useEffect(() => {
        // Fetch favorite episodes from the 'favorite_episodes' table
        const fetchFavoriteEpisodes = async () => {
            try {
                const { data, error } = await supabase.from('favorite_episodes').select('*');
                if (error) {
                    console.error('Error fetching favorite episodes:', error);
                } else {
                    setFavoriteEpisodes(data);
                }
            } catch (error) {
                console.error('Error fetching favorite episodes:', error);
            }
        };

        fetchFavoriteEpisodes();
    }, []);




    const handleDelete = async (episodeId) => {
        try {
            // Remove the episode from the local state (UI)
            setFavoriteEpisodes((prevEpisodes) => prevEpisodes.filter((episode) => episode.id !== episodeId));

            // Remove the episode from the database
            const { data, error } = await supabase.from('favorite_episodes').delete().eq('id', episodeId);

            if (error) {
                console.error('Error deleting episode from the database:', error);
            } else {
                console.log('Episode deleted from the database:', data);
            }
        } catch (error) {
            console.error('Error handling episode deletion:', error);
        }
    };

    const handleShare = async (episode) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: episode.title,
                    text: episode.description,
                    // Add other data fields as needed
                    // url: episode.link, // Replace with the actual link to the episode
                });
                console.log('Link shared');
            } else {
                console.log('Web Share API is not supported in this browser.');
            }
        } catch (error) {
            console.error('Error sharing the episode:', error);
        }
    };

    const toggleShowMore = () => {
        setShowMore((prevShowMore) => !prevShowMore);
    };

    return (
        <div>
            <h2>Favorite Episodes</h2>
            {favoriteEpisodes.map((episode, index) => (
                <Card
                    key={episode.id}
                    style={{ marginBottom: '20px', display: showMore || index < 3 ? 'block' : 'none' }}
                >
                    <CardContent>
                        <Typography variant="h6">{episode.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Episode: {episode.episode}
                        </Typography>

                        <br />

                        <Typography>{episode.description}</Typography>
                    </CardContent>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '16px',
                            backgroundColor: '#f0f0f0', // Background color
                            transition: 'background-color 0.3s', // Smooth color transition
                        }}
                    >
                        <IconButton onClick={() => handlePlay(episode)} style={{ color: '#0077b6' }}>
                            <PlayCircleOutlineIcon />
                        </IconButton>

                        <IconButton onClick={() => handleDelete(episode.id)} style={{ color: '#e63946' }}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => handleShare(episode)} style={{ color: '#2a9d8f' }}>
                            <ShareIcon />
                        </IconButton>
                    </div>
                </Card>
            ))}

            <button onClick={toggleShowMore} className="show-more-button">
                {showMore ? 'Show Less' : 'Show More'}
            </button>

            {/* AudioPlayer component */}
            <AudioPlayer
                episode={{ file: selectedEpisodeAudio }}
                isPlaying={isAudioPlaying}
                onClose={() => setIsAudioPlaying(false)}
            />

            <Dialog open={isEpisodeModalOpen} onClose={() => setIsEpisodeModalOpen(false)}>
                <DialogTitle>Episode Player</DialogTitle>
                <DialogContent>
                    <audio controls>
                        <source src={selectedEpisodeAudio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <Button onClick={() => setIsEpisodeModalOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default FavoriteEpisode;
