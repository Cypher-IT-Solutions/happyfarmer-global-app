import React from 'react';

const StarRating = ({ rating, maxStars = 5, onRatingChange, size = 'md' }) => {
    const stars = [];

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-3xl'
    };

    const handleClick = (index) => {
        if (onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    for (let i = 0; i < maxStars; i++) {
        stars.push(
            <span
                key={i}
                className={`${sizeClasses[size]} cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'
                    } transition-colors duration-200`}
                onClick={() => handleClick(i)}
            >
                ★
            </span>
        );
    }

    return <div className="flex space-x-1">{stars}</div>;
};

export default StarRating;
