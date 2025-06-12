import React from "react";
import { useSelector } from 'react-redux';
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import RegisterUser from './components/demoComponents/RegisterUser';
import AuthRouteWrapper from './utilities/AuthRouteWrapper';
import AccountSettingsPage from "./components/demoComponents/AccountSettingsPage";

import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import DirectPasswordReset from "./components/auth/DirectPasswordReset";
import PortfolioLanding from "./pages/PortfolioLanding";

const MainContent = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Routes>
                <Route path="/" element={<PortfolioLanding />} />
                <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate replace to="/"/>}/>
                <Route path="/register" element={!isAuthenticated ? <RegisterUser/> : <Navigate replace to="/"/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/direct-reset" element={<DirectPasswordReset/>}/>
                <Route path="/change-password" element={<ChangePasswordPage/>}/>
                <Route path="/edit-account" element={<AuthRouteWrapper><AccountSettingsPage/></AuthRouteWrapper>}/>

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
