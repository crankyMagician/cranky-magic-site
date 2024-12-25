import React from "react";
import { useSelector } from 'react-redux';
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import ForgotPassword from './components/demoComponents/ForgotPassword';
import LoginUser from './components/demoComponents/LoginUser';
import RegisterUser from './components/demoComponents/RegisterUser';
import Example from "./example/Example";
import AuthRouteWrapper from './utilities/AuthRouteWrapper';
import AccountSettingsPage from "./components/demoComponents/AccountSettingsPage";
// Import the ContactUs component
import ContactUs from "./components/demoComponents/ContactUsComponent"; // Make sure this path is correct
import NewsletterSignup from "./components/demoComponents/NewsletterSignup";
import AboutUs from "./components/demoComponents/AboutUs";
import StreamVideo  from "./components/demoComponents/StreamVideo";
import Calendar from "./components/demoComponents/Calendar";
import LandingPage from "./components/demoComponents/LandingPage";
import MovesList from "./components/API/Moves/movesList";
import MovesDataGrid from "./components/API/Moves/MovesDataGrid";
import MunchieDataGrid from "./components/API/Munchies/MunchieDataGrid";
import AbilitiesDataGrid from "./components/API/Abilities/AbilitiesDataGrid";
import CreateAbility from "./components/API/Abilities/CreateAbility";
import CraftingRecipesDataGrid from "./components/API/CraftingRecipes/CraftingRecipesDataGrid";
import ItemsDataGrid from "./components/API/Items/ItemsDataGrid";
import EffectsDataGrid from "./components/API/Effects/EffectsDataGrid";
import MunchiePhotoUploadWrapper from "./components/API/MunchiePhotos/MunchiePhotoUploadWrapper";
import ItemPhotoUploadWrapper from "./components/API/ItemPhotos/ItemPhotoUploadWrapper";
import PhotoDisplayTest from "./components/Photos/PhotoDisplayTest";
import TestMunchieDisplay from "./components/API/Munchies/TestMunchieDisplay";
import CreateMunchieForm from "./components/API/Munchies/CreateMunchieForm";
import MunchieCarousel from "./components/API/Munchies/MunchieCarousel";
import ComprehensiveMunchieManager from "./components/API/Munchies/ComprehensiveMunchieManager";
import MunchieViewer from "./components/API/Munchies/MunchieViewer";
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
                <Route path="/munchie-grid" element={<MunchieDataGrid/>}/>
                <Route path="/abilities-grid" element={<AbilitiesDataGrid/>}/>

                <Route path="/recipe-grid" element={<CraftingRecipesDataGrid/>}/>
                <Route path="/items-grid" element={<ItemsDataGrid/>}/>

                <Route path="/effects-grid" element={<EffectsDataGrid/>}/>

                <Route path="/munchie-photo" element={<MunchiePhotoUploadWrapper/>}/>

                <Route path="/item-photo" element={<ItemPhotoUploadWrapper/>}/>

                <Route path="/create-munchie" element={<CreateMunchieForm/>}/>
                <Route path="/munchie-carousel" element={<MunchieCarousel/>}/>
                <Route path="/munchie-viewer" element={<MunchieViewer/>}/>
                <Route path="/munchies/manage/:munchieId/:munchieName" element={<ComprehensiveMunchieManager />} />                <Route path="/test-photo" element={<PhotoDisplayTest/>}/>
                <Route path="/test-md" element={<TestMunchieDisplay/>}/>


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
