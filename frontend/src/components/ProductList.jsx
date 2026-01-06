import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No products available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
