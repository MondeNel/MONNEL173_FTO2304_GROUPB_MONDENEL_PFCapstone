import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar_components/Navbar';

const API_URL = 'https://podcast-api.netlify.app/shows';

const Home = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch data when the component mounts
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((result) => {
                setData(result);
                console.log(result); // Log the fetched data
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <Navbar />

            {data ? (
                <div>
                    {/* Display data or any other components here */}
                </div>
            ) : (
                <div>Loading...</div>
            )}

            <button>Log out</button>
        </div>
    );
}

export default Home;
