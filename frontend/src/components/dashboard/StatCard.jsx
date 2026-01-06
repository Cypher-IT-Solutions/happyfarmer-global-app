import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, variant = 'default', trend, delay = 0 }) => {
    const variants = {
        default: 'bg-white text-gray-900',
        primary: 'bg-primary-50 border-primary-100 text-primary-900',
        warning: 'bg-yellow-50 border-yellow-100 text-yellow-900',
        success: 'bg-green-50 border-green-100 text-green-900',
    };

    const iconColors = {
        default: 'text-gray-400 bg-gray-100',
        primary: 'text-primary-600 bg-primary-100',
        warning: 'text-yellow-600 bg-yellow-100',
        success: 'text-green-600 bg-green-100',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay / 1000 }}
            className={cn(
                "p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow",
                variants[variant]
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", iconColors[variant])}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                        trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
            <div>
                <dt className="text-sm font-medium text-gray-500">{title}</dt>
                <dd className="text-2xl font-bold mt-1 tracking-tight">{value}</dd>
            </div>
        </motion.div>
    );
};

export { StatCard };
