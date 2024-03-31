//src/utlities/AuthRouteWrapper.js
// AuthRouteWrapper.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const AuthRouteWrapper = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AuthRouteWrapper;