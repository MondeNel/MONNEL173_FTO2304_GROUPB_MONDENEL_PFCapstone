import React from 'react';

const Favorites = ({ favorite_shows }) => {
    return (
        <div>
            {favorite_shows.map((favoriteShow, index) => (
                <div key={index} className="favorite_show_card">
                    <h2>{favoriteShow.title}</h2>
                    <div className="likes">{favoriteShow.likes}</div>
                </div>
            ))}
        </div>
    );
};

export default Favorites;
