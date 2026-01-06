import React from 'react';
import { Link } from 'react-router-dom';

const FarmerCard = ({ farmer }) => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-gray-200 w-full object-cover">
                {/* Placeholder for farm image - in real app would be farmer.imageUrl */}
                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                    <span className="text-3xl">🚜</span>
                </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                    {farmer.farmName}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 line-clamp-2">
                    {farmer.bio || "Local farmer delivering fresh produce."}
                </p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        OPEN
                    </span>
                    <Link to={`/farmers/${farmer.id}`} className="text-sm font-medium text-brand-DEFAULT hover:text-brand-dark">
                        View Products &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FarmerCard;
