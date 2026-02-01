import React, { useEffect, useState } from 'react';
import { getFarmers, getNearbyFarmers } from '../services/api';
import FarmerCard from '../components/FarmerCard';
import DistanceFilter from '../components/DistanceFilter';

const FarmerList = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(50);

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

    const handleLocationChange = async (coords) => {
        setUserLocation(coords);
        setLoading(true);
        try {
            const nearbyFarmers = await getNearbyFarmers(coords.lat, coords.lng, distance);
            setFarmers(nearbyFarmers);
        } catch (err) {
            setError('Failed to load nearby farmers');
        } finally {
            setLoading(false);
        }
    };

    const handleDistanceChange = async (newDistance) => {
        setDistance(newDistance);
        if (userLocation) {
            setLoading(true);
            try {
                const nearbyFarmers = await getNearbyFarmers(userLocation.lat, userLocation.lng, newDistance);
                setFarmers(nearbyFarmers);
            } catch (err) {
                setError('Failed to load nearby farmers');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading farmers...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="px-4 py-8 sm:px-0">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-earth-900">Our Local Farmers</h1>
                <p className="mt-2 text-earth-600">Support your community by buying directly from these producers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-1">
                    <DistanceFilter
                        onLocationChange={handleLocationChange}
                        onDistanceChange={handleDistanceChange}
                    />
                </div>

                <div className="lg:col-span-3">
                    {farmers.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg shadow">
                            <p className="text-earth-500 block">
                                {userLocation ? 'No farmers found within your selected distance.' : 'No farmers found in your area yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {farmers.map((farmer, index) => (
                                <FarmerCard key={farmer.id || index} farmer={farmer} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerList;
