import React from "react";
import { useSelector } from 'react-redux';
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import RegisterUser from './components/demoComponents/RegisterUser';
import Example from "./example/Example";
import AuthRouteWrapper from './utilities/AuthRouteWrapper';
import AccountSettingsPage from "./components/demoComponents/AccountSettingsPage";
// Import the ContactUs component
import ContactUs from "./components/common/ContactUsComponent"; // Make sure this path is correct
import NewsletterSignup from "./components/demoComponents/NewsletterSignup";
import AboutUs from "./components/common/AboutUs";
import StreamVideo from "./components/demoComponents/StreamVideo";
import Calendar from "./components/demoComponents/Calendar";
import LandingPage from "./components/demoComponents/LandingPage";
import BusinessSignupPage from "./pages/BusinessSignupPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import DirectPasswordReset from "./components/Auth/DirectPasswordReset";
import SpatialDemoPanel from "./components/demo/SpatialDemoPanel";

const MainContent = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Routes>
                <Route path="/" element={<Example />} />
                <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate replace to="/"/>}/>
                <Route path="/register" element={!isAuthenticated ? <RegisterUser/> : <Navigate replace to="/"/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/direct-reset" element={<DirectPasswordReset/>}/>
                <Route path="/change-password" element={<ChangePasswordPage/>}/>
                <Route path="/edit-account" element={<AuthRouteWrapper><AccountSettingsPage/></AuthRouteWrapper>}/>
                <Route path="/business-signup" element={<BusinessSignupPage />} />

                {/* API Routes*/}
               
                {/* Unauthenticated Routes*/}
                <Route path="/contact-us" element={<ContactUs/>}/>
                <Route path="/newsletter-signup" element={<NewsletterSignup/>}/>
                <Route path="/about-us" element={<AboutUs/>}/>
                <Route path="/video-stream" element={<StreamVideo/>}/>
                <Route path="/calendar" element={<Calendar/>}/>
                <Route path="/theme" element={<Example/>}/>
                {/* Redirect unauthenticated users attempting to access unknown routes to the login page */}
                <Route path="*" element={<Navigate replace to="/"/>}/>
            </Routes>
        </div>
    );
};

export default MainContent;
