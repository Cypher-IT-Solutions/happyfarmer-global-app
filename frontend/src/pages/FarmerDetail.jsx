import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFarmerById, getProductsByFarmer } from '../services/api';
import ProductList from '../components/ProductList';

const FarmerDetail = () => {
    const { id } = useParams();
    const [farmer, setFarmer] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                    <h1 className="text-3xl font-bold text-earth-900">{farmer.farmName}</h1>
                    <p className="mt-1 max-w-2xl text-sm text-earth-500">{farmer.address}</p>
                </div>
                <div className="border-t border-earth-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">About</dt>
                            <dd className="mt-1 text-sm text-gray-900">{farmer.bio}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="border-t border-earth-200 pt-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-6">Current Harvest</h2>
                <ProductList products={products} />
            </div>
        </div>
    );
};

export default FarmerDetail;
