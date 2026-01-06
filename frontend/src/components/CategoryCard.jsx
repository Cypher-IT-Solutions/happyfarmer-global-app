import { motion } from 'framer-motion';
import {
    Apple,
    Carrot,
    Milk,
    Flame,
    Croissant,
    Coffee,
    Box,
    Sprout
} from 'lucide-react';

const categoryIcons = {
    FRUIT: { icon: Apple, color: 'bg-red-50 text-red-600', label: 'Fruits' },
    VEGETABLE: { icon: Carrot, color: 'bg-orange-50 text-orange-600', label: 'Vegetables' },
    DAIRY: { icon: Milk, color: 'bg-blue-50 text-blue-600', label: 'Dairy & Eggs' },
    MEAT: { icon: Flame, color: 'bg-rose-50 text-rose-600', label: 'Meat' },
    BAKERY: { icon: Croissant, color: 'bg-amber-50 text-amber-600', label: 'Bakery' },
    PANTRY: { icon: Box, color: 'bg-stone-50 text-stone-600', label: 'Pantry' },
    BEVERAGE: { icon: Coffee, color: 'bg-teal-50 text-teal-600', label: 'Beverages' },
    OTHER: { icon: Sprout, color: 'bg-emerald-50 text-emerald-600', label: 'Other' },
};

const CategoryCard = ({ category, isActive, onClick, label }) => {
    const config = categoryIcons[category] || categoryIcons.OTHER;
    const Icon = config.icon;

    return (
        <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex flex-col items-center min-w-[100px] p-4 rounded-2xl transition-all ${isActive
                    ? 'bg-brand text-white shadow-lg shadow-brand-light'
                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                }`}
        >
            <div className={`p-3 rounded-xl mb-3 ${isActive ? 'bg-white/20 text-white' : config.color}`}>
                <Icon size={24} />
            </div>
            <span className="text-sm font-bold truncate w-full text-center">
                {label || config.label}
            </span>
        </motion.button>
    );
};

export default CategoryCard;
