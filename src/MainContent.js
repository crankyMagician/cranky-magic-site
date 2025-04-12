import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes, AuthGuard } from './routes';
import { useSelector } from 'react-redux';

const MainContent = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Routes>
                {/* Generate routes from centralized route configuration */}
                {routes.map((route) => {
                    const { path, component: Component, exact, auth, roles = [] } = route;

                    // Determine what to render
                    const renderComponent = () => {
                        // For authenticated routes
                        if (auth) {
                            return (
                                <AuthGuard requiredRoles={roles}>
                                    <Component />
                                </AuthGuard>
                            );
                        }

                        // For login page (redirect if already authenticated)
                        if (path === '/login' && isAuthenticated) {
                            return <Navigate replace to="/" />;
                        }

                        // For regular routes
                        return <Component />;
                    };

                    return (
                        <Route
                            key={path}
                            path={path}
                            element={renderComponent()}
                            exact={exact}
                        />
                    );
                })}

                {/* Catch-all redirect to home */}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </div>
    );
};

export default MainContent;