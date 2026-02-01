import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Globe } from 'lucide-react';

const AddressEntryModal = ({ isOpen, onClose, onAddressSelect }) => {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [detectingCountry, setDetectingCountry] = useState(true);

    // Auto-detect country from IP on mount
    useEffect(() => {
        const detectCountry = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setCountry(data.country_name || '');
            } catch (error) {
                console.error('Failed to detect country:', error);
            } finally {
                setDetectingCountry(false);
            }
        };

        if (isOpen) {
            detectCountry();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Geocode the city and country
            const address = `${city}, ${country}`;
            const response = await fetch(
                `http://localhost:8080/api/geocoding/search?q=${encodeURIComponent(address)}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const location = data[0];
                onAddressSelect({
                    displayName: `${city}, ${country}`,
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.lon),
                    city,
                    country
                });
                onClose();
            } else {
                alert('Location not found. Please check your city and country.');
            }
        } catch (error) {
            console.error('Error geocoding location:', error);
            alert('Failed to find location. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand to-brand-dark text-white p-8 rounded-t-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">Where are you?</h2>
                                    <p className="text-white/80 text-sm">Find fresh produce near you</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* City Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-gray-400 ml-1">
                                City
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <MapPin size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g., Springfield"
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all font-medium"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Country Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-gray-400 ml-1">
                                Country
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Globe size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder={detectingCountry ? "Detecting..." : "e.g., United States"}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all font-medium"
                                    required
                                    disabled={detectingCountry}
                                />
                            </div>
                            {detectingCountry && (
                                <p className="text-xs text-gray-500 ml-1">Auto-detecting your country...</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !city || !country}
                            className="w-full py-4 bg-brand hover:bg-brand-dark text-white rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Finding location...' : 'Continue'}
                        </button>

                        {/* Skip Option */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
                        >
                            Skip for now - Browse all products
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddressEntryModal;
