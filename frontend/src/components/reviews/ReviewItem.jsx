import React, { useState } from 'react';
import StarRating from './StarRating';
import { replyToReview } from '../../services/api';

const ReviewItem = ({ review, isFarmerView, onReplied }) => {
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSubmitting(true);
        try {
            await replyToReview(review.id, replyText);
            setReplyText('');
            setIsReplying(false);
            if (onReplied) onReplied();
        } catch (error) {
            console.error('Failed to reply:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="border-b border-gray-100 py-6 last:border-b-0">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    {review.customerProfileImage ? (
                        <img
                            src={review.customerProfileImage}
                            alt={review.customerName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-earth-200 flex items-center justify-center text-earth-700 font-bold uppercase">
                            {review.customerName?.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-earth-900">{review.customerName}</h4>
                        <div className="flex items-center space-x-2">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-xs text-earth-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-3 text-earth-700 leading-relaxed">{review.comment}</p>

            {review.farmerReply && (
                <div className="mt-4 ml-6 p-4 bg-gray-50 rounded-lg border-l-4 border-leaf-500">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-semibold text-earth-900">Farmer's Response</h5>
                        <span className="text-xs text-earth-500">
                            {new Date(review.replyCreatedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-earth-700 italic">"{review.farmerReply}"</p>
                </div>
            )}

            {isFarmerView && !review.farmerReply && (
                <div className="mt-4">
                    {!isReplying ? (
                        <button
                            onClick={() => setIsReplying(true)}
                            className="text-sm font-medium text-leaf-600 hover:text-leaf-700 transition-colors duration-200 underline"
                        >
                            Reply to this review
                        </button>
                    ) : (
                        <form onSubmit={handleReplySubmit} className="mt-2">
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-leaf-500 transition-all duration-200"
                                rows="2"
                                placeholder="Type your response..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            ></textarea>
                            <div className="mt-2 flex space-x-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-leaf-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-leaf-700 transition-colors duration-200"
                                >
                                    {submitting ? 'Sending...' : 'Post Reply'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
