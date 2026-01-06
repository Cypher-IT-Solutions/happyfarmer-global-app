import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const InactivityTimer = ({ timeout = 1800000 }) => { // Default to 30 minutes
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const timeoutId = useRef(null);

    const resetTimer = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
            if (isAuthenticated) {
                console.log("Inactivity detected. Logging out...");
                logout();
                navigate('/login?expired=true');
            }
        }, timeout);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            if (timeoutId.current) clearTimeout(timeoutId.current);
            return;
        }

        // List of events that reset the timer
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart'
        ];

        // Set initial timer
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timeoutId.current) clearTimeout(timeoutId.current);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [isAuthenticated, logout, navigate, timeout]);

    return null; // This component doesn't render anything
};

export default InactivityTimer;
