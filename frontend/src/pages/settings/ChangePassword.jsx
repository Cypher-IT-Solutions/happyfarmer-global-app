import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { changePassword as changePasswordApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword.length < 8) {
            showToast("New password must be at least 8 characters long.", "warning");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            showToast("Passwords do not match.", "warning");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await changePasswordApi(formData.oldPassword, formData.newPassword);
            showToast("Password updated successfully!");
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update password. Please check your current password.";
            showToast(msg, "error");
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
                            <Shield size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">Security</h1>
                            <p className="text-sm text-gray-500 font-medium">Update your password to keep your account secure.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-gray-400 ml-1">Current Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="oldPassword"
                                    type="password"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-400 ml-1">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        name="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all font-medium"
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-400 ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all font-medium"
                                        placeholder="Repeat new password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-brand hover:bg-brand-dark text-white rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading && <Loader2 size={20} className="animate-spin" />}
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
