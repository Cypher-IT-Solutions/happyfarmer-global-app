import { useState, useEffect, useMemo } from 'react';
import { getFarmerOrders, updateOrderStatus } from '../services/api';
import ReviewList from '../components/reviews/ReviewList';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { OrderStatusChart } from '../components/dashboard/OrderStatusChart';
import { OrdersTable } from '../components/dashboard/OrdersTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import {
    DollarSign,
    ShoppingCart,
    Clock,
    TrendingUp,
    Package,
    AlertCircle,
    Leaf
} from 'lucide-react';

const FarmerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'FARMER') {
            navigate('/');
        } else {
            fetchOrders();
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getFarmerOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            if (err.response && err.response.status === 500) {
                setError("Could not load orders. You might not have a farmer profile linked.");
            } else {
                setError("Failed to load orders. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (err) {
            console.error("Failed to update status:", err);
            setError("Failed to update order status.");
        }
    };

    const stats = useMemo(() => {
        const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
        const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
        const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

        return { totalSales, pendingOrders, deliveredOrders, avgOrderValue };
    }, [orders]);

    const orderStatusData = useMemo(() => {
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        const allStatuses = [
            { key: 'PENDING', name: 'Pending', color: '#f59e0b' },
            { key: 'ACCEPTED', name: 'Confirmed', color: '#3b82f6' },
            { key: 'PREPARING', name: 'Preparing', color: '#6366f1' },
            { key: 'READY_FOR_PICKUP', name: 'Ready', color: '#8b5cf6' },
            { key: 'OUT_FOR_DELIVERY', name: 'Out for Delivery', color: '#a855f7' },
            { key: 'COMPLETED', name: 'Completed', color: '#10b981' },
            { key: 'DELIVERED', name: 'Delivered', color: '#059669' },
            { key: 'CANCELLED', name: 'Cancelled', color: '#ef4444' },
        ];

        return allStatuses
            .map(s => ({
                name: s.name,
                value: statusCounts[s.key] || 0,
                color: s.color
            }))
            .filter(item => item.value > 0);
        console.log(orderStatusData);
    }, [orders]);

    // Calculate actual revenue data from orders
    const revenueData = useMemo(() => {
        const now = new Date();

        const getEmptyDays = (count) => Array.from({ length: count }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (count - 1 - i));
            return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), revenue: 0, orders: 0, date: d };
        });

        const getEmptyWeeks = (count) => Array.from({ length: count }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (count - 1 - i) * 7);
            return { label: `Week ${i + 1}`, revenue: 0, orders: 0, date: d };
        });

        const getEmptyMonths = (count) => Array.from({ length: count }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (count - 1 - i));
            return { label: d.toLocaleDateString('en-US', { month: 'short' }), revenue: 0, orders: 0, date: d };
        });

        const weekly = getEmptyDays(7);
        const monthly = getEmptyWeeks(4);
        const yearly = getEmptyMonths(12);

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const amount = order.totalAmount || 0;

            // Fill weekly (last 7 days)
            const dayMatch = weekly.find(d => d.date.toDateString() === orderDate.toDateString());
            if (dayMatch) {
                dayMatch.revenue += amount;
                dayMatch.orders += 1;
            }

            // Fill yearly (last 12 months)
            const monthMatch = yearly.find(m =>
                m.date.getMonth() === orderDate.getMonth() &&
                m.date.getFullYear() === orderDate.getFullYear()
            );
            if (monthMatch) {
                monthMatch.revenue += amount;
                monthMatch.orders += 1;
            }

            // Fill monthly (rough week approximation)
            const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
            if (diffDays < 28) {
                const weekIdx = 3 - Math.floor(diffDays / 7);
                if (weekIdx >= 0 && weekIdx < 4) {
                    monthly[weekIdx].revenue += amount;
                    monthly[weekIdx].orders += 1;
                }
            }
        });

        return { weekly, monthly, yearly };
    }, [orders]);

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary-50">
                                <Leaf className="h-8 w-8 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Farm Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 font-medium">
                                    Welcome back, {user?.fullName?.split(" ")[0]}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button asChild variant="secondary" className="bg-white shadow-none border-gray-200">
                                <Link to="/products" className="flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Inventory
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalSales.toFixed(2)}`}
                        icon={DollarSign}
                        variant="primary"
                        trend={{ value: 12.5, isPositive: true }}
                        delay={0}
                    />
                    <StatCard
                        title="Total Orders"
                        value={orders.length}
                        icon={ShoppingCart}
                        trend={{ value: 8.2, isPositive: true }}
                        delay={100}
                    />
                    <StatCard
                        title="Pending Orders"
                        value={stats.pendingOrders}
                        icon={Clock}
                        variant="warning"
                        delay={200}
                    />
                    <StatCard
                        title="Avg. Order Value"
                        value={`$${stats.avgOrderValue.toFixed(2)}`}
                        icon={TrendingUp}
                        variant="success"
                        trend={{ value: 4.1, isPositive: true }}
                        delay={300}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-2">
                        <RevenueChart data={revenueData} title="Revenue Analysis" />
                    </div>
                    <div>
                        <OrderStatusChart data={orderStatusData} />
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <Alert variant="destructive" className="mb-10 shadow-sm border-red-200">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Orders Table */}
                {!error && orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">No orders found yet</p>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                            Your recent customer orders will appear here once they start purchasing your fresh produce.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-10">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                            <Button variant="ghost" size="sm" className="text-primary-600">View All</Button>
                        </div>
                        <OrdersTable orders={orders} onStatusUpdate={handleStatusUpdate} />
                    </div>
                )}

                {/* Reviews Section */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-yellow-50">
                            <TrendingUp className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Customer Feedback</h2>
                    </div>
                    {user?.id && (
                        <ReviewList
                            farmerId={user.id}
                            isFarmerView={true}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default FarmerDashboard;
