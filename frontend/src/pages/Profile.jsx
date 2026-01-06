import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/api';
import { User, Mail, Calendar, MapPin, Shield, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setProfile(data);
            } catch (err) {
                setError("Failed to load profile details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const sections = [
        {
            title: 'Account Settings',
            description: 'Manage your personal information and address.',
            links: [
                { label: 'Update Address', to: '/settings/address', icon: MapPin },
                { label: 'Security & Password', to: '/settings/password', icon: Shield },
            ]
        }
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
    );

    const user = profile || authUser;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-8">
                <div className="bg-brand h-32 w-full relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                            <div className="w-full h-full bg-brand-dark rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {user?.fullName?.[0] || 'U'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-16 pb-8 px-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
                        <div className="flex items-center flex-wrap gap-y-2 gap-x-4 mt-2">
                            <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                                <Mail size={14} className="text-brand" /> {user?.email}
                            </span>
                            {user?.phoneNumber && (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden md:block" />
                                    <span className="text-sm text-gray-500 font-medium">{user.phoneNumber}</span>
                                </>
                            )}
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium capitalize">
                                <User size={14} className="text-brand" /> {user?.role?.toLowerCase()}
                            </span>
                        </div>
                        {user?.address && (
                            <div className="mt-3 flex items-start gap-1.5 text-sm text-gray-400">
                                <MapPin size={14} className="mt-0.5" />
                                <span className="font-medium">{user.address}</span>
                            </div>
                        )}
                    </div>
                    <button
                        className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-bold border border-gray-100 transition-colors shadow-sm disabled:opacity-50"
                    >
                        Edit Profile [Stub]
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 px-1">{section.title}</h3>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                            {section.links.map((link, lIdx) => (
                                <Link
                                    key={lIdx}
                                    to={link.to}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand">
                                            <link.icon size={20} />
                                        </div>
                                        <span className="text-gray-700 font-bold text-sm">{link.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-brand transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
