import React, { useState, useEffect } from 'react';
import { MapPin, Home, Building, Globe, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserProfile, updateUserAddress } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const UpdateAddress = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const { showToast } = useToast();
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [locationStatus, setLocationStatus] = useState('idle');

    useEffect(() => {
        const fetchCurrentAddress = async () => {
            try {
                const data = await getUserProfile();
                setAddress(data.address || '');
            } catch (err) {
                console.error("Failed to load current address", err);
            } finally {
                setFetching(false);
            }
        };
        fetchCurrentAddress();
    }, []);

    const requestLocation = () => {
        setLocationStatus('requesting');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationStatus('success');
                    showToast('Location captured!');
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocationStatus('error');
                    showToast('Location access denied', 'warning');
                }
            );
        } else {
            setLocationStatus('unsupported');
            showToast('Geolocation not supported', 'warning');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateUserAddress({
                address,
                latitude: coordinates.lat,
                longitude: coordinates.lng
            });
            showToast("Address updated successfully!");
        } catch (err) {
            showToast("Failed to update address. Please try again.", "error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <Link to="/profile" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand mb-6 transition-colors font-bold">
                <ArrowLeft size={16} className="mr-2" /> Back to Profile
            </Link>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">Address</h1>
                            <p className="text-sm text-gray-500 font-medium">Manage your delivery and billing locations.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">

                    {fetching ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-brand animate-spin" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-400 ml-1">Street Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Home size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all font-medium"
                                        placeholder="123 Farm Lane, Springfield"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-400 ml-1">Location (Optional)</label>
                                <button
                                    type="button"
                                    onClick={requestLocation}
                                    disabled={locationStatus === 'requesting'}
                                    className="w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <MapPin size={16} />
                                    {locationStatus === 'requesting' ? 'Getting location...' :
                                        locationStatus === 'success' ? '✓ Location captured' :
                                            'Use My Location'}
                                </button>
                                {locationStatus === 'success' && (
                                    <p className="text-xs text-green-600 ml-1">
                                        Coordinates will be saved for better recommendations
                                    </p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-brand hover:bg-brand-dark text-white rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading && <Loader2 size={20} className="animate-spin" />}
                                    {loading ? 'Saving...' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateAddress;
