import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    CheckCircle2,
    PlayCircle,
    PackageCheck,
    Truck,
    ChevronRight,
    MapPin,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { cn } from '../utils/cn';

const OrderProgressTracker = ({ status }) => {
    const steps = [
        { id: 'PENDING', label: 'Placed', icon: ShoppingBag },
        { id: 'ACCEPTED', label: 'Confirmed', icon: CheckCircle2 },
        { id: 'PREPARING', label: 'Preparing', icon: PlayCircle },
        { id: 'READY', label: 'Ready', icon: PackageCheck, statusGroup: ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'] },
        { id: 'COMPLETED', label: 'Delivered', icon: Truck, statusGroup: ['COMPLETED', 'DELIVERED'] }
    ];

    const currentIdx = steps.findIndex(s =>
        s.id === status || (s.statusGroup && s.statusGroup.includes(status))
    );

    return (
        <div className="px-2 py-6">
            <div className="relative flex justify-between">
                {/* Progress Lines */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%` }}
                    className="absolute top-1/2 left-0 h-0.5 bg-brand-DEFAULT -translate-y-1/2 z-0 transition-all duration-500"
                />

                {steps.map((step, idx) => {
                    const isActive = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isActive ? '#10b981' : '#f3f4f6', // brand-DEFAULT (approx) or gray-100
                                    color: isActive ? '#ffffff' : '#9ca3af'
                                }}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors",
                                    isActive ? "bg-brand-DEFAULT" : "bg-gray-100"
                                )}
                            >
                                <step.icon size={18} />
                            </motion.div>
                            <span className={cn(
                                "mt-2 text-[10px] font-black uppercase tracking-tighter transition-colors",
                                isActive ? "text-brand-dark" : "text-gray-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getMyOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError("Failed to load your orders.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-vh-100 bg-gray-50/50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-50 border-t-brand-DEFAULT"></div>
                <p className="text-sm font-bold text-gray-500 animate-pulse">Growing your history...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-16 z-30">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                            <ChevronRight className="rotate-180" size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-earth-900 tracking-tight">Order History</h1>
                            <p className="text-earth-500 font-medium text-sm">Track your farm-to-table journey</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-10">
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-700 mb-8">
                        <ShoppingBag className="text-red-400" />
                        <p className="font-bold text-sm">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-brand-DEFAULT" />
                        </div>
                        <h3 className="text-2xl font-black text-earth-900 mb-2">No fresh finds yet</h3>
                        <p className="text-earth-500 max-w-sm mx-auto mb-8 font-medium">Your harvest journey starts with your first order from our local farmers.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-DEFAULT text-white rounded-2xl font-black shadow-lg shadow-brand-DEFAULT/20 hover:bg-brand-dark transition-all transform hover:scale-105"
                        >
                            Explore Market <ArrowRight size={20} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group"
                            >
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <span>REF: {order.id.slice(0, 8)}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-earth-900 group-hover:text-brand-DEFAULT transition-colors">
                                                {order.farmer?.farmName || "Direct from Farm"} Order
                                            </h3>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="text-3xl font-black text-brand-DEFAULT">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 mb-8">
                                        <OrderProgressTracker status={order.status} />
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 text-earth-500 font-bold text-sm">
                                            <MapPin size={16} className="text-brand-DEFAULT" />
                                            <span>{order.deliveryAddress || "Standard Pickup Site"}</span>
                                        </div>
                                        <button className="text-sm font-black text-earth-400 hover:text-earth-900 transition-colors flex items-center gap-1">
                                            View Details <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
