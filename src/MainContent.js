import React from "react";
import { useSelector } from 'react-redux';
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import AuthRouteWrapper from './utilities/AuthRouteWrapper';

import PortfolioLanding from "./pages/PortfolioLanding";
import Example from "./example/Example";

const MainContent = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Routes>
                <Route path="/" element={<PortfolioLanding />} />
                <Route path="/theme" element={<Example />} />


                {/* API Routes*/}
               
                {/* Unauthenticated Routes*/}
                { /* <Route path="/contact-us" element={<ContactUs/>}/>*/}

                {/* Redirect unauthenticated users attempting to access unknown routes to the login page */}
                <Route path="*" element={<Navigate replace to="/"/>}/>
            </Routes>
        </div>
    );
};

export default MainContent;
