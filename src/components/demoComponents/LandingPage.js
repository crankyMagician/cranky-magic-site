import React from 'react';
import NewsletterSignup from "./NewsletterSignup";
import HeroSection from "./HeroSection";
import ActionCall from "./ActionCall";
import Faqs from "./Faqs";
import ActionCallContact from "./ActionCallContact";

const LandingPage = () => {
    return (
        <div>
            <HeroSection />
            <ActionCall />
            <NewsletterSignup />
            <ActionCallContact />
            <Faqs />
        </div>
    );
};

export default LandingPage;
