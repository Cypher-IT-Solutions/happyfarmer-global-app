import React, { useState } from 'react';
import StarRating from './StarRating';
import { createReview } from '../../services/api';

const ReviewForm = ({ farmerId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating');
            return;
        }
        if (!comment.trim()) {
            setError('Please enter a comment');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await createReview(farmerId, { rating, comment });
            setRating(0);
            setComment('');
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-earth-900">Leave a Review</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-leaf-500 focus:border-transparent outline-none transition-all duration-200"
                        rows="4"
                        placeholder="Share your experience with this farmer..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-leaf-600 text-white py-2 rounded-md font-medium hover:bg-leaf-700 transition-colors duration-200 ${submitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
