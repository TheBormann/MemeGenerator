import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiController from '../data/ApiController';

const AuthenticatedWrapper = ({ children }) => {
    const navigate = useNavigate();
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            const currentAuthToken = sessionStorage.getItem('authToken');
            if (!currentAuthToken) {
                navigate('/login');
                return;
            }

            // Validate the token
            const isValidToken = await ApiController.validateToken();
            if (!isValidToken) {
                sessionStorage.removeItem('authToken'); // Clear invalid token
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
                    sessionStorage.removeItem('authToken'); // if user cannot be found there must be another problem
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
