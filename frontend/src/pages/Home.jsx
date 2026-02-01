import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../services/api';
import MarketHero from '../components/MarketHero';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import ProductDetailModal from '../components/ProductDetailModal';
import AddressEntryModal from '../components/AddressEntryModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Check if user has previously set their location
    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            setUserLocation(JSON.parse(savedLocation));
        } else {
            // Show address modal for first-time visitors
            setShowAddressModal(true);
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!userLocation) {
                // Don't fetch products until location is set
                setLoading(false);
                return;
            }

            try {
                // Always fetch nearby products when location is available
                const data = await api.getNearbyProducts(userLocation.lat, userLocation.lng, 50);
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [userLocation]);

    const handleAddressSelect = (addressData) => {
        const location = {
            lat: addressData.lat,
            lng: addressData.lng,
            address: addressData.displayName
        };
        setUserLocation(location);
        localStorage.setItem('userLocation', JSON.stringify(location));
    };

    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(location);
                    localStorage.setItem('userLocation', JSON.stringify(location));
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setShowAddressModal(true);
                }
            );
        } else {
            setShowAddressModal(true);
        }
    };

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

    if (!userLocation) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand/5 to-white">
                    <div className="text-center max-w-md px-4">
                        <div className="text-6xl mb-6">📍</div>
                        <h2 className="text-3xl font-black text-earth-900 mb-4">Set Your Location</h2>
                        <p className="text-earth-600 mb-8">
                            We need to know where you are to show you fresh products from nearby farmers.
                        </p>
                        <button
                            onClick={() => setShowAddressModal(true)}
                            className="px-8 py-4 bg-brand hover:bg-brand-dark text-white rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all transform active:scale-[0.98]"
                        >
                            Enter Your Location
                        </button>
                    </div>
                </div>

                {/* Address Entry Modal */}
                <AddressEntryModal
                    isOpen={showAddressModal}
                    onClose={() => setShowAddressModal(false)}
                    onAddressSelect={handleAddressSelect}
                />
            </>
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
                                    onViewDetails={handleViewDetails}
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

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Address Entry Modal */}
            <AddressEntryModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onAddressSelect={handleAddressSelect}
            />
        </div>
    );
};

export default Home;
