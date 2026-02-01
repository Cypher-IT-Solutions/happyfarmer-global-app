import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Calendar, Package, Tag, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = React.useState(1);

    if (!product) return null;

    const isDiscontinued = product.active === false;
    const isOutOfStock = !isDiscontinued && product.stockQuantity === 0;
    const isAvailable = !isDiscontinued && !isOutOfStock;

    const handleIncrement = () => setQuantity(prev => Math.min(prev + 1, product.stockQuantity));
    const handleDecrement = () => setQuantity(prev => Math.max(prev - 1, 1));

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-[100] cursor-pointer"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl pointer-events-auto flex flex-col md:flex-row relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md rounded-full text-earth-900 hover:bg-white transition-colors z-10 shadow-sm border border-gray-100"
                            >
                                <X size={24} />
                            </button>

                            {/* Image Section */}
                            <div className="md:w-1/2 h-64 md:h-auto bg-gray-50 relative">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-brand-light/20 to-primary-light/20">
                                        {product.category === 'FRUIT' ? '🍎' :
                                            product.category === 'VEGETABLE' ? '🥦' :
                                                product.category === 'DAIRY' ? '🥛' : '📦'}
                                    </div>
                                )}
                                <div className="absolute bottom-6 left-6">
                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-black tracking-widest text-earth-900 uppercase shadow-sm">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
                                <div className="mb-8">
                                    <h2 className="text-4xl font-black text-earth-900 mb-2">{product.name}</h2>
                                    <div className="flex items-center gap-2 text-brand font-bold">
                                        <Tag size={16} />
                                        <span>Local Fresh {product.category.toLowerCase()} — {product.farmerName || product.farmer?.name || 'Local Farmer'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <span className="text-[10px] text-earth-400 font-black uppercase tracking-widest mb-1 block">Price</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-earth-900">${product.price}</span>
                                            <span className="text-sm text-earth-500 font-medium">/ {product.unit}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <span className="text-[10px] text-earth-400 font-black uppercase tracking-widest mb-1 block">Availability</span>
                                        <div className="flex items-center gap-2">
                                            <Package size={18} className="text-earth-900" />
                                            {isDiscontinued ? (
                                                <span className="text-lg font-bold text-red-600">Discontinued</span>
                                            ) : isOutOfStock ? (
                                                <span className="text-lg font-bold text-orange-600">Out of Stock</span>
                                            ) : (
                                                <span className="text-lg font-bold text-earth-900">{product.stockQuantity} in stock</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <div className="flex items-center gap-2 text-earth-900 font-bold mb-2">
                                            <Info size={18} />
                                            <h3>Description</h3>
                                        </div>
                                        <p className="text-earth-500 leading-relaxed">
                                            {product.description || "No description provided for this harvested item. Connect with the farmer for more details about their sustainable practices."}
                                        </p>
                                    </div>

                                    {product.harvestDate && (
                                        <div className="flex items-center gap-3 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
                                            <Calendar className="text-primary-600" size={20} />
                                            <div>
                                                <span className="text-[10px] text-primary-600 font-black uppercase tracking-widest block leading-none mb-1">Harvested / Packed On</span>
                                                <span className="text-sm font-bold text-earth-900">{new Date(product.harvestDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black text-earth-900 uppercase tracking-widest">Select Quantity</span>
                                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                            <button
                                                onClick={handleDecrement}
                                                className="w-10 h-10 flex items-center justify-center text-earth-900 hover:bg-white rounded-lg transition-colors font-black text-xl"
                                            >-</button>
                                            <span className="w-12 text-center font-black text-earth-900">{quantity}</span>
                                            <button
                                                onClick={handleIncrement}
                                                className="w-10 h-10 flex items-center justify-center text-earth-900 hover:bg-white rounded-lg transition-colors font-black text-xl"
                                            >+</button>
                                        </div>
                                    </div>

                                    <motion.button
                                        disabled={!isAvailable}
                                        whileHover={isAvailable ? { scale: 1.02 } : {}}
                                        whileTap={isAvailable ? { scale: 0.98 } : {}}
                                        onClick={() => {
                                            if (isAvailable) {
                                                addToCart(product, quantity);
                                                onClose();
                                            }
                                        }}
                                        className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${!isAvailable
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-brand text-white shadow-xl shadow-brand/20 hover:bg-brand-dark'
                                            }`}
                                    >
                                        <ShoppingCart size={22} />
                                        {isDiscontinued ? 'Discontinued' : isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart — $${(product.price * quantity).toFixed(2)}`}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailModal;
