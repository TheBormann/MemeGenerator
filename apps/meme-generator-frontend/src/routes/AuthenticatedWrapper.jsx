import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiController from '../data/ApiController';

const AuthenticatedWrapper = ({ children }) => {
    const navigate = useNavigate();
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            const currentAuthToken = sessionStorage.getItem('authToken');
            const expiration = sessionStorage.getItem('authExpiration');
            if (!currentAuthToken) {
                navigate('/login');
                return;
            }

            if (expiration && new Date(expiration) < new Date()) {
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('authExpiration');
                navigate('/login');
                return;
            }

            // Check for user data in the session storage
            const currentUserData = sessionStorage.getItem('userData');
            if (!currentUserData) {
                try {
                    await ApiController.fetchUserData();
                    setIsUserAuthenticated(true);
                } catch (error) {
                    sessionStorage.removeItem('authToken');
                    sessionStorage.removeItem('authExpiration');
                    navigate('/login');
                }
            } else {
                setIsUserAuthenticated(true);
            }
        };

        checkAuthentication();
    }, [navigate]);

    return isUserAuthenticated ? children : null;
};

export default AuthenticatedWrapper;
