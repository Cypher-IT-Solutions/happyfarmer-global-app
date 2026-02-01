import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const DistanceFilter = ({ onDistanceChange, onLocationChange }) => {
    const [distance, setDistance] = useState(50);
    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('idle');

    const requestLocation = () => {
        setLocationStatus('requesting');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(coords);
                    setLocationStatus('success');
                    onLocationChange(coords);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocationStatus('error');
                }
            );
        } else {
            setLocationStatus('unsupported');
        }
    };

    useEffect(() => {
        if (userLocation) {
            onDistanceChange(distance);
        }
    }, [distance, userLocation, onDistanceChange]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin className="text-brand" size={20} />
                    <h3 className="font-bold text-earth-900">Find Nearby Farmers</h3>
                </div>
                {userLocation && (
                    <span className="text-xs text-green-600 font-medium">✓ Location set</span>
                )}
            </div>

            <button
                onClick={requestLocation}
                disabled={locationStatus === 'requesting'}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand text-white rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                <Navigation size={18} />
                {locationStatus === 'requesting' ? 'Getting location...' :
                    locationStatus === 'success' ? 'Update My Location' :
                        'Use My Location'}
            </button>

            {locationStatus === 'error' && (
                <p className="text-xs text-red-600">
                    Location access denied. Please enable location permissions.
                </p>
            )}

            {locationStatus === 'unsupported' && (
                <p className="text-xs text-red-600">
                    Geolocation is not supported by your browser.
                </p>
            )}

            {userLocation && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-earth-700">Distance</span>
                        <span className="text-lg font-black text-brand">{distance} km</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between text-xs text-earth-400 font-medium">
                        <span>5 km</span>
                        <span>100 km</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DistanceFilter;
