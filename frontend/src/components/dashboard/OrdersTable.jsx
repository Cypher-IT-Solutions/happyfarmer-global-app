import React from 'react';
import { ExternalLink, CheckCircle2, Play, PackageCheck, Truck, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const OrdersTable = ({ orders, onStatusUpdate }) => {
    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'ACCEPTED': 'bg-blue-50 text-blue-700 border-blue-200',
            'PREPARING': 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'READY_FOR_PICKUP': 'bg-purple-50 text-purple-700 border-purple-200',
            'OUT_FOR_DELIVERY': 'bg-purple-50 text-purple-700 border-purple-200',
            'DELIVERED': 'bg-green-50 text-green-700 border-green-200',
            'CANCELLED': 'bg-red-50 text-red-700 border-red-200',
            'COMPLETED': 'bg-green-100 text-green-800 border-green-300',
        };
        return colors[status] || colors.PENDING;
    };

    const getNextAction = (order) => {
        switch (order.status) {
            case 'PENDING':
                return { label: 'Acknowledge', value: 'ACCEPTED', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200' };
            case 'ACCEPTED':
                return { label: 'Prepare', value: 'PREPARING', icon: Play, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200' };
            case 'PREPARING':
                const readyValue = order.isDelivery ? 'OUT_FOR_DELIVERY' : 'READY_FOR_PICKUP';
                return { label: 'Mark Ready', value: readyValue, icon: PackageCheck, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200' };
            case 'READY_FOR_PICKUP':
            case 'OUT_FOR_DELIVERY':
                return { label: 'Complete', value: 'COMPLETED', icon: Truck, color: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200' };
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Live Orders</h3>
                <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center">
                    View All <ExternalLink className="ml-1 h-3 w-3" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {orders.map((order) => {
                            const action = getNextAction(order);
                            return (
                                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 font-mono">#{order.id.substring(0, 8)}</span>
                                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.customer?.fullName || 'Anonymous'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={cn(
                                            "px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border",
                                            getStatusColor(order.status)
                                        )}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {action ? (
                                            <button
                                                onClick={() => onStatusUpdate(order.id, action.value)}
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all transform active:scale-95 shadow-sm",
                                                    action.color
                                                )}
                                            >
                                                <action.icon size={14} />
                                                {action.label}
                                            </button>
                                        ) : (
                                            <span className="text-xs font-medium text-gray-400">No pending actions</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export { OrdersTable };
