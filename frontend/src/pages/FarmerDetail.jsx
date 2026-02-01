import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFarmerById, getProductsByFarmer } from '../services/api';
import ProductList from '../components/ProductList';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import StarRating from '../components/reviews/StarRating';

const FarmerDetail = () => {
    const { id } = useParams();
    const [farmer, setFarmer] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshReviews, setRefreshReviews] = useState(0);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isCustomer = currentUser?.role === 'CUSTOMER';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [farmerData, productsData] = await Promise.all([
                    getFarmerById(id),
                    getProductsByFarmer(id)
                ]);
                setFarmer(farmerData);
                setProducts(productsData);
            } catch (err) {
                setError('Failed to load farmer details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading details...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!farmer) return <div className="text-center py-10">Farmer not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-12 border border-earth-100">
                <div className="md:flex">
                    {farmer.imageUrl && (
                        <div className="md:flex-shrink-0">
                            <img className="h-48 w-full object-cover md:w-48" src={farmer.imageUrl} alt={farmer.farmName} />
                        </div>
                    )}
                    <div className="p-8 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold text-earth-900 tracking-tight">{farmer.farmName}</h1>
                                <div className="flex items-center mt-2 space-x-2">
                                    <StarRating rating={Math.round(farmer.averageRating || 0)} size="sm" />
                                    <span className="text-earth-700 font-semibold">{farmer.averageRating?.toFixed(1) || '0.0'}</span>
                                    <span className="text-earth-400">({farmer.reviewCount || 0} reviews)</span>
                                </div>
                                <p className="mt-2 text-earth-600 flex items-center">
                                    <svg className="h-5 w-5 mr-1 text-leaf-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {farmer.address}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-earth-900 mb-2">Our Story</h3>
                            <p className="text-earth-700 leading-relaxed italic">"{farmer.bio}"</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold text-earth-900 mb-8 flex items-center">
                        <span className="bg-leaf-100 text-leaf-800 p-2 rounded-lg mr-3">🌾</span>
                        Current Harvest
                    </h2>
                    <ProductList products={products} />
                </div>

                <div className="lg:col-span-1">
                    {isCustomer && (
                        <ReviewForm
                            farmerId={id}
                            onReviewSubmitted={() => setRefreshReviews(prev => prev + 1)}
                        />
                    )}
                    <ReviewList
                        farmerId={id}
                        refreshTrigger={refreshReviews}
                    />
                </div>
            </div>
        </div>
    );
};

export default FarmerDetail;
