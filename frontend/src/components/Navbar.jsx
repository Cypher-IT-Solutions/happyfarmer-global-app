import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount } = useCart();
    const { isAuthenticated, logout, user, viewMode, switchViewMode } = useAuth();
    const navigate = useNavigate();
    const cartCount = getCartCount();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const handleSwitchMode = () => {
        switchViewMode();
        setIsMenuOpen(false);
        // Redirect to appropriate landing page on switch
        if (viewMode === 'BUYER') {
            navigate('/dashboard'); // Switching TO Seller
        } else {
            navigate('/'); // Switching TO Buyer
        }
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-brand">HappyFarmer</span>
                        </Link>
                        {viewMode === 'BUYER' && (
                            <div className="hidden sm:ml-6 sm:space-x-8 sm:flex">
                                <Link to="/farmers" className="border-transparent text-earth-700 hover:border-brand hover:text-brand-dark inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Farmers
                                </Link>
                            </div>
                        )}
                        {viewMode === 'SELLER' && (
                            <div className="hidden sm:ml-6 sm:space-x-8 sm:flex">
                                <Link to="/dashboard" className="border-transparent text-primary-700 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Dashboard
                                </Link>
                                <Link to="/products" className="border-transparent text-primary-700 hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Inventory
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        {viewMode === 'BUYER' && (
                            <Link to="/cart" className="relative p-2 text-earth-400 hover:text-earth-600">
                                <span className="sr-only">View cart</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-earth-900 transform translate-x-1/4 -translate-y-1/4 border border-red-600 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-200 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center text-white font-bold text-xs">
                                        {user.fullName?.[0]}
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm hidden md:inline">Account</span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50 overflow-hidden anim-fade-in">
                                        <div className="px-4 py-3">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                        </div>

                                        <div className="py-1">
                                            {user.role === 'FARMER' ? (
                                                <button
                                                    onClick={handleSwitchMode}
                                                    className="group flex items-center w-full px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 font-bold"
                                                >
                                                    <svg className="mr-3 h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                    </svg>
                                                    {viewMode === 'BUYER' ? 'Switch to Selling' : 'Switch to Buying'}
                                                </button>
                                            ) : (
                                                <Link
                                                    to="/become-farmer"
                                                    onClick={closeMenu}
                                                    className="group flex items-center px-4 py-2 text-sm text-brand hover:bg-brand-50 font-bold"
                                                >
                                                    <svg className="mr-3 h-5 w-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Become a Farmer
                                                </Link>
                                            )}
                                        </div>

                                        <div className="py-1">
                                            <Link to="/profile" onClick={closeMenu} className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                My Profile
                                            </Link>
                                            <Link to="/my-orders" onClick={closeMenu} className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                My Orders
                                            </Link>
                                            <Link to="/settings/address" onClick={closeMenu} className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Update Address
                                            </Link>
                                            <Link to="/settings/password" onClick={closeMenu} className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Change Password
                                            </Link>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-sm hover:shadow-md">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
