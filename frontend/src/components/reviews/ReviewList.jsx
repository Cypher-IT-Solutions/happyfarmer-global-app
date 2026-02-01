import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';
import { getFarmerReviews, getFarmerAverageRating } from '../../services/api';
import StarRating from './StarRating';

const ReviewList = ({ farmerId, isFarmerView = false, refreshTrigger = 0 }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const [reviewsData, ratingData] = await Promise.all([
                    getFarmerReviews(farmerId),
                    getFarmerAverageRating(farmerId)
                ]);
                setReviews(reviewsData);
                setAverageRating(ratingData);
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        if (farmerId) {
            fetchReviews();
        }
    }, [farmerId, refreshTrigger]);

    if (loading) return <div className="text-center py-4 text-earth-500">Loading reviews...</div>;

    const displayReviews = isExpanded ? reviews : reviews.slice(0, 3);
    const hasMore = reviews.length > 3;

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6 border-b border-earth-200 pb-4">
                <h2 className="text-2xl font-bold text-earth-900">Customer Reviews</h2>
                <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-earth-100 shadow-sm">
                    <StarRating rating={Math.round(averageRating)} size="md" />
                    <span className="text-earth-900 font-bold text-xl">{averageRating?.toFixed(1)}</span>
                    <span className="text-earth-500 text-sm">({reviews.length} reviews)</span>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg text-earth-500">
                    No reviews yet. Be the first to leave one!
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 divide-y divide-gray-100">
                        {displayReviews.map((review) => (
                            <ReviewItem
                                key={review.id}
                                review={review}
                                isFarmerView={isFarmerView}
                                onReplied={() => {
                                    // Re-fetch reviews to show the new reply
                                    getFarmerReviews(farmerId).then(setReviews);
                                }}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-flex items-center text-leaf-600 font-semibold hover:text-leaf-700 transition-all duration-200"
                            >
                                {isExpanded ? (
                                    <>Show Less ↑</>
                                ) : (
                                    <>View All {reviews.length} Reviews ↓</>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewList;
