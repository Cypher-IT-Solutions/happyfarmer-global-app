import React from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative"
        >
            {/* Wishlist Button (Aesthetic only for now) */}
            <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors z-10 shadow-sm">
                <Heart size={18} />
            </button>

            {/* Image Container */}
            <div className="h-56 relative overflow-hidden bg-gray-50">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-6xl bg-gradient-to-br from-brand-light/20 to-primary-light/20 group-hover:scale-110 transition-transform duration-500">
                        {product.category === 'FRUIT' ? '🍎' :
                            product.category === 'VEGETABLE' ? '🥦' :
                                product.category === 'DAIRY' ? '🥛' : '📦'}
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest text-earth-900 uppercase shadow-sm">
                        {product.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-earth-900 group-hover:text-brand transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </div>

                <p className="text-sm text-earth-500 line-clamp-2 mb-4 h-10">
                    {product.description || "Freshly harvested and ready for your kitchen. Supporting local farmers never tasted so good."}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-earth-900">${product.price}</span>
                        <span className="text-[10px] text-earth-400 font-bold uppercase tracking-tighter">PER {product.unit || 'UNIT'}</span>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(product)}
                        className="p-4 bg-brand text-white rounded-2xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 group/btn overflow-hidden relative"
                    >
                        <ShoppingCart size={20} className="relative z-10" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
