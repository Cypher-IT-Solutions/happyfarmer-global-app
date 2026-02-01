import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getFavorites, addFavorite, removeFavorite, getUserProfile } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [favorites, setFavorites] = useState([]); // Array of Product objects or IDs
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('viewMode') || 'BUYER';
    });

    const login = useCallback((userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        // Default to SELLER if they are a farmer logging in, or BUYER otherwise
        setViewMode(userData.role === 'FARMER' ? 'SELLER' : 'BUYER');

        // Fetch favorites
        getFavorites(userData.id)
            .then(data => setFavorites(data))
            .catch(err => console.error("Failed to load favorites", err));
    }, []);

    const updateUser = useCallback((userData, authToken) => {
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
    }, []);

    const switchViewMode = useCallback(() => {
        setViewMode(prev => prev === 'BUYER' ? 'SELLER' : 'BUYER');
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setFavorites([]);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('viewMode');
        setViewMode('BUYER');
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            setToken(storedToken);
            // Optimistically set user from storage if available
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                if (parsed.role !== 'FARMER') setViewMode('BUYER');
            }

            // Fetch fresh profile to ensure we have the ID and latest data
            getUserProfile()
                .then(userData => {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));

                    // Sync viewMode
                    if (userData.role !== 'FARMER') {
                        setViewMode('BUYER');
                    }

                    // Fetch favorites using the confirmed ID
                    return getFavorites(userData.id);
                })
                .then(data => setFavorites(data))
                .catch(err => {
                    console.error("Failed to rehydrate session", err);
                    if (err.response && err.response.status === 401) {
                        logout();
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [logout]);

    const toggleFavorite = async (product) => {
        if (!user) return; // Or trigger login modal
        console.log("User", user);

        const isLiked = favorites.some(f => f.id === product.id);

        // Optimistic update
        if (isLiked) {
            setFavorites(prev => prev.filter(f => f.id !== product.id));
            try {
                await removeFavorite(user.id, product.id);
            } catch (err) {
                console.error("Failed to remove favorite", err);
                // Revert
                setFavorites(prev => [...prev, product]);
            }
        } else {
            setFavorites(prev => [...prev, product]);
            try {
                console.log("Adding favorite", user.id, product.id);
                await addFavorite(user.id, product.id);
            } catch (err) {
                console.error("Failed to add favorite", err);
                // Revert
                setFavorites(prev => prev.filter(f => f.id !== product.id));
            }
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated,
            loading,
            updateUser,
            viewMode,
            switchViewMode,
            favorites,
            toggleFavorite
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
