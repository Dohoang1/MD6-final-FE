import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateAdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'ADMIN') {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateAdminRoute;
