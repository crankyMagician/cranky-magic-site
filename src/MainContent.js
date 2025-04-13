import React, { useEffect, useRef, useState, useMemo } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes/routeConfig';
import { AuthGuard } from './routes';
import { useSelector } from 'react-redux';

// Use React.memo to prevent unnecessary renders
const MainContent = React.memo(() => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const routesRef = useRef(routes);
    const initialRenderRef = useRef(true);

    // Only log on mount and unmount
    useEffect(() => {
        console.log('MainContent mounted');
        return () => {
            console.log('MainContent unmounted');
        };
    }, []);

    // Log only on first render
    if (initialRenderRef.current) {
        console.log(`MainContent rendering with ${routes.length} routes`);
        initialRenderRef.current = false;
    }

    // Memoize route elements to prevent recreation
    const routeElements = useMemo(() => {
        return routesRef.current.map((route) => {
            const { path, element, exact, auth, roles = [] } = route;

            // Determine what to render
            let renderedElement;
            if (auth) {
                renderedElement = <AuthGuard requiredRoles={roles}>{element}</AuthGuard>;
            } else if (path === '/login' && isAuthenticated) {
                renderedElement = <Navigate replace to="/" />;
            } else {
                renderedElement = element;
            }

            return (
                <Route
                    key={path}
                    path={path}
                    element={renderedElement}
                    exact={exact || undefined}
                />
            );
        });
    }, [isAuthenticated]); // Only rebuild routes when authentication state changes

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Routes>
                {routeElements}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </div>
    );
});

export default MainContent;