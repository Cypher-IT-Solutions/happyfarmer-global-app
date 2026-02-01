import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { favorites, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-6xl mb-4">💔</div>
                <h2 className="text-2xl font-extrabold text-earth-900">No favorites yet</h2>
                <p className="mt-4 text-earth-600">Start exploring and save your favorite local goods here!</p>
                <div className="mt-8">
                    <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-brand hover:bg-brand-dark transition-colors">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-earth-900">My Favorites</h1>
                <span className="bg-brand-50 text-brand-700 py-1 px-3 rounded-full text-sm font-bold">
                    {favorites.length} items
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favorites.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Favorites;
