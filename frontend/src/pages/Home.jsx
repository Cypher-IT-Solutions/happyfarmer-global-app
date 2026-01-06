import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../services/api';
import MarketHero from '../components/MarketHero';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Product processing
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, activeCategory]);

    // Grouping by category
    const groupedProducts = useMemo(() => {
        const groups = {};
        filteredProducts.forEach(p => {
            if (!groups[p.category]) groups[p.category] = [];
            groups[p.category].push(p);
        });
        return groups;
    }, [filteredProducts]);

    const categories = ['ALL', 'FRUIT', 'VEGETABLE', 'DAIRY', 'MEAT', 'BAKERY', 'PANTRY', 'BEVERAGE'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <MarketHero onSearch={setSearchQuery} />

            {/* Category Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="flex overflow-x-auto pb-6 gap-4 no-scrollbar">
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat}
                            category={cat === 'ALL' ? 'OTHER' : cat}
                            label={cat === 'ALL' ? 'Everything' : undefined}
                            isActive={activeCategory === cat}
                            onClick={() => setActiveCategory(cat)}
                        />
                    ))}
                </div>
            </div>

            {/* Marketplace Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <AnimatePresence mode="wait">
                    {Object.keys(groupedProducts).length > 0 ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {Object.entries(groupedProducts).map(([category, items]) => (
                                <ProductGrid
                                    key={category}
                                    title={category.charAt(0) + category.slice(1).toLowerCase() + 's'}
                                    products={items}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-20 text-center"
                        >
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-earth-900">No products found</h3>
                            <p className="text-earth-500">Try adjusting your search or category filter.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
                                className="mt-6 text-brand font-bold underline"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Home;
