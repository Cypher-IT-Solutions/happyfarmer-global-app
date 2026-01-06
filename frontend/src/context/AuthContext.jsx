import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('viewMode') || 'BUYER';
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);

            // Sync viewMode: if not a farmer, force BUYER mode
            if (parsedUser.role !== 'FARMER') {
                setViewMode('BUYER');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('viewMode', viewMode);
    }, [viewMode]);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        // Default to SELLER if they are a farmer logging in, or BUYER otherwise
        setViewMode(userData.role === 'FARMER' ? 'SELLER' : 'BUYER');
    };

    const updateUser = (userData, authToken) => {
        setUser(userData);
        if (authToken) {
            setToken(authToken);
            localStorage.setItem('token', authToken);
        }
        localStorage.setItem('user', JSON.stringify(userData));
        // If they just upgraded, switch them to SELLER mode automatically
        if (userData.role === 'FARMER') {
            setViewMode('SELLER');
        }
    };

    const switchViewMode = () => {
        setViewMode(prev => prev === 'BUYER' ? 'SELLER' : 'BUYER');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('viewMode');
        setViewMode('BUYER');
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            updateUser,
            isAuthenticated,
            loading,
            viewMode,
            switchViewMode
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
