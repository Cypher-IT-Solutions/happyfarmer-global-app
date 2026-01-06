import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { upgradeToFarmer } from '../services/api';
import { useNavigate } from 'react-router-dom';

const BecomeFarmer = () => {
    const { user, updateUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/login');
            } else if (user.role === 'FARMER') {
                navigate('/dashboard');
            }
        }
    }, [user, navigate, authLoading]);

    const [formData, setFormData] = useState({
        farmName: '',
        bio: '',
        contactEmail: user?.email || '',
        contactPhone: user?.phoneNumber || '',
        address: '',
        offersDelivery: false,
        deliveryRadiusKm: 10,
        deliveryFeeBase: 5.00,
        offersPickup: true,
        pickupInstructions: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await upgradeToFarmer(formData);
            // Response structure is AuthResponse: {token, email, fullName, role, message}
            updateUser({
                email: response.email,
                fullName: response.fullName,
                role: response.role
            }, response.token);

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to upgrade profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900">Become a Farmer</h2>
                <p className="mt-4 text-lg text-gray-500">
                    Join our community and start selling your fresh products directly to consumers.
                </p>
            </div>

            <div className="bg-white shadow sm:rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Farm Name</label>
                            <input
                                type="text"
                                name="farmName"
                                required
                                value={formData.farmName}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Green Acres Farm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">About Your Farm</label>
                            <textarea
                                name="bio"
                                rows={3}
                                value={formData.bio}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Describe your farming practices and what makes your products special..."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Farm Address</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        name="offersDelivery"
                                        type="checkbox"
                                        checked={formData.offersDelivery}
                                        onChange={handleChange}
                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="font-medium text-gray-700">I offer delivery</label>
                                    <p className="text-gray-500">Enable this if you can deliver products to customers.</p>
                                </div>
                            </div>

                            {formData.offersDelivery && (
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 pl-7">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Delivery Radius (km)</label>
                                        <input
                                            type="number"
                                            name="deliveryRadiusKm"
                                            value={formData.deliveryRadiusKm}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Base Delivery Fee ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="deliveryFeeBase"
                                            value={formData.deliveryFeeBase}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        name="offersPickup"
                                        type="checkbox"
                                        checked={formData.offersPickup}
                                        onChange={handleChange}
                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="font-medium text-gray-700">I offer pickup</label>
                                    <p className="text-gray-500">Enable this if customers can pick up orders from your location.</p>
                                </div>
                            </div>

                            {formData.offersPickup && (
                                <div className="pl-7">
                                    <label className="block text-sm font-medium text-gray-700">Pickup Instructions</label>
                                    <textarea
                                        name="pickupInstructions"
                                        rows={2}
                                        value={formData.pickupInstructions}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="E.g., Park at the red barn, knock on the side door..."
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm font-medium">{error}</div>
                        )}

                        <div className="pt-5">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Processing...' : 'Create Farmer Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BecomeFarmer;
