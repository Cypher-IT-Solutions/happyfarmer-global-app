import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const MarketHero = ({ onSearch }) => {
    return (
        <div className="relative overflow-hidden bg-white py-16 sm:py-24">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-brand-light rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-light rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-black text-earth-900 tracking-tight leading-tight">
                        Fresh from our <span className="text-brand">soil</span>,<br />
                        straight to your <span className="text-primary-600">table</span>.
                    </h1>
                    <p className="mt-6 text-xl text-earth-600 max-w-2xl mx-auto">
                        Support local farmers and enjoy the season's finest products. Real food, grown with passion, right in your community.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 max-w-xl mx-auto"
                >
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            onChange={(e) => onSearch(e.target.value)}
                            placeholder="Search for fresh tomatoes, honey, or sourdough..."
                            className="block w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 text-earth-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand-DEFAULT transition-all shadow-sm focus:shadow-md"
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-earth-500">
                        <span>Popular:</span>
                        {['Organic Honey', 'Fresh Eggs', 'Artisan Bread', 'Berries'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => onSearch(tag)}
                                className="px-3 py-1 bg-white border border-gray-100 rounded-full hover:bg-brand-50 hover:text-brand-dark transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MarketHero;
