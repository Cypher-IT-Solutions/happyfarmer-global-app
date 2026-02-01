import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Toast = ({ id, message, type }) => {
    const { removeToast } = useToast();

    const variants = {
        success: {
            bg: 'bg-green-500',
            icon: <CheckCircle className="text-white" size={20} />,
        },
        error: {
            bg: 'bg-red-500',
            icon: <XCircle className="text-white" size={20} />,
        },
        warning: {
            bg: 'bg-amber-500',
            icon: <AlertCircle className="text-white" size={20} />,
        },
    };

    const style = variants[type] || variants.success;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`${style.bg} p-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] pointer-events-auto`}
        >
            <div className="flex-shrink-0">
                {style.icon}
            </div>
            <p className="text-white font-bold flex-1">{message}</p>
            <button
                onClick={() => removeToast(id)}
                className="text-white/80 hover:text-white transition-colors"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
};

const ToastContainer = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
