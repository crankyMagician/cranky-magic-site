import React from "react";
import { useSelector } from 'react-redux';
import AuthRouteWrapper from './utilities/AuthRouteWrapper';

import PortfolioLanding from "./pages/PortfolioLanding";

const MainContent = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <PortfolioLanding />
        </div>
    );
};

export default MainContent;
