import React, { useEffect, useState } from 'react';
import { getFarmers } from '../services/api';
import FarmerCard from '../components/FarmerCard';

const FarmerList = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const data = await getFarmers();
                setFarmers(data);
            } catch (err) {
                setError('Failed to load farmers');
            } finally {
                setLoading(false);
            }
        };

        fetchFarmers();
    }, []);

    if (loading) return <div className="text-center py-10">Loading farmers...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="px-4 py-8 sm:px-0">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-earth-900">Our Local Farmers</h1>
                <p className="mt-2 text-earth-600">Support your community by buying directly from these producers.</p>
            </div>

            {farmers.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-earth-500 block">No farmers found in your area yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {farmers.map(farmer => (
                        <FarmerCard key={farmer.id} farmer={farmer} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FarmerList;
