import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';

const ProductGrid = ({ title, products, categoryId }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="py-12 border-b border-gray-50 last:border-0">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black text-earth-900">{title}</h2>
                    <p className="text-earth-500 mt-1">Hand-picked fresh items just for you</p>
                </div>
                <button className="flex items-center text-brand-DEFAULT font-bold hover:text-brand-dark transition-colors group">
                    View All <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
