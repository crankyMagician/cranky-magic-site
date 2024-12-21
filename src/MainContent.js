import React from "react";
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './components/ForgotPassword';
import LoginUser from './components/LoginUser';
import RegisterUser from './components/RegisterUser';
import Example from "./example/Example";
import AuthRouteWrapper from './utilities/AuthRouteWrapper';
import AccountSettingsPage from "./components/AccountSettingsPage";
// Import the ContactUs component
import ContactUs from "./components/ContactUsComponent"; // Make sure this path is correct
import NewsletterSignup from "./components/NewsletterSignup";
import AboutUs from "./components/AboutUs";
import StreamVideo  from "./components/StreamVideo";
import Calendar from "./components/Calendar";
import LandingPage from "./components/LandingPage";
import MovesList from "./components/API/Moves/movesList";
import MovesDataGrid from "./components/API/Moves/MovesDataGrid";
const MainContent = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={!isAuthenticated ? <LoginUser/> : <Navigate replace to="/"/>}/>
                <Route path="/register" element={!isAuthenticated ? <RegisterUser/> : <Navigate replace to="/"/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/edit-account" element={<AuthRouteWrapper><AccountSettingsPage/></AuthRouteWrapper>}/>

                {/* API Routes*/}
                <Route path="/moves-list" element={<MovesList/>}/>
                <Route path="/moves-grid" element={<MovesDataGrid/>}/>

                {/* Unauthenticated Routes*/}
                <Route path="/contact-us" element={<ContactUs/>}/>
                <Route path="/newsletter-signup" element={<NewsletterSignup/>}/>
                <Route path="/about-us" element={<AboutUs/>}/>
                <Route path="/video-stream" element={<StreamVideo/>}/>
                <Route path="/calendar" element={<Calendar/>}/>
                <Route path="/theme" element={<Example/>}/>
                {/* Redirect unauthenticated users attempting to access unknown routes to the login page */}
                <Route path="*" element={<Navigate replace to="/login"/>}/>
            </Routes>
        </div>
    );
};

export default MainContent;
