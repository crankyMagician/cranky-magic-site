// src/routes/routeConfig.js
import React from 'react';
import {
    Home,
    CalendarMonth,
    Info,
    ContactMail,
    Email,
    VideoLibrary,
    Style as StyleIcon,
    AccountCircle,
    Dashboard as DashboardIcon,
    Settings,
    Business,
    Campaign as CampaignIcon,
    People as PeopleIcon,
    Security as SecurityIcon,
    Email as EmailIcon
} from '@mui/icons-material';

// Import components explicitly with the proper names
// Check these imports carefully - one of them is likely causing the error
import Example from '../example/Example';

import AboutUs from '../components/common/AboutUs';
import StreamVideo from '../components/demoComponents/StreamVideo';
import Calendar from '../components/demoComponents/Calendar';



// Add console logging to verify each component is a function
console.log('Component types check:');
console.log('Example:', typeof Example);

console.log('AboutUs:', typeof AboutUs);
console.log('StreamVideo:', typeof StreamVideo);
console.log('Calendar:', typeof Calendar);


console.log('SpatialDemoPanel:', typeof SpatialDemoPanel);


// Create a fallback component for any invalid components
const FallbackComponent = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Component Not Available</h2>
        <p>The requested component couldn't be loaded.</p>
    </div>
);

/**
 * Application route configuration
 * This is the master list of all routes in the application
 */
const routes = [
    // Main/Dashboard pages
    {
        path: '/',
        // Use a conditional to ensure valid component
        element: typeof Example === 'function' ? <Example /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Home',
            description: 'Welcome to our application',
            icon: <Home />,
            nav: {
                label: 'Home',
                group: 'main',
                order: 1,
                showInNav: true,
                showInFooter: true,
            }
        }
    },
    {
        path: '/theme',
        element: typeof Example === 'function' ? <Example /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Theme Demo',
            description: 'Theme demonstration and customization options',
            icon: <StyleIcon />,
            nav: {
                label: 'Theme',
                group: 'main',
                order: 2,
                showInNav: true,
                showInFooter: false,
            }
        }
    },





   /* {
        path: '/edit-account',
        element: typeof AccountSettingsPage === 'function' ? <AccountSettingsPage /> : <FallbackComponent />,
        exact: true,
        auth: true,
        meta: {
            title: 'Account Settings',
            description: 'Manage your account settings',
            icon: <AccountCircle />,
            nav: {
                label: 'Account Settings',
                group: 'account',
                order: 1,
                showInNav: true,
                showInFooter: false,
            }
        }
    },*/

/*
    // Content pages
    {
        path: '/about-us',
        element: typeof AboutUs === 'function' ? <AboutUs /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'About Us',
            description: 'Learn more about our company and mission',
            icon: <Info />,
            nav: {
                label: 'About Us',
                group: 'company',
                order: 1,
                showInNav: true,
                showInFooter: true,
            }
        }
    },

 */
    /* {
         path: '/contact-us',
         element: typeof ContactUs === 'function' ? <ContactUs /> : <FallbackComponent />,
         exact: true,
         auth: false,
         meta: {
             title: 'Contact Us',
             description: 'Get in touch with our team',
             icon: <ContactMail />,
             nav: {
                 label: 'Contact Us',
                 group: 'company',
                 order: 2,
                 showInNav: true,
                 showInFooter: true,
             }
         }
     },*/
/*
    {
        path: '/video-stream',
        element: typeof StreamVideo === 'function' ? <StreamVideo /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Video Stream',
            description: 'Watch our video content',
            icon: <VideoLibrary />,
            nav: {
                label: 'Video Stream',
                group: 'media',
                order: 1,
                showInNav: true,
                showInFooter: true,
            }
        }
    },
    {
        path: '/calendar',
        element: typeof Calendar === 'function' ? <Calendar /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Calendar',
            description: 'View our upcoming events',
            icon: <CalendarMonth />,
            nav: {
                label: 'Calendar',
                group: 'media',
                order: 2,
                showInNav: true,
                showInFooter: true,
            }
        }
    },*/
/*
    // Legal pages - these were causing the error at line 223
    {
        path: '/terms',
        element: typeof AboutUs === 'function' ? <AboutUs /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Terms of Service',
            description: 'Our terms of service',
            icon: null,
            nav: {
                label: 'Terms of Service',
                group: 'legal',
                order: 1,
                showInNav: false,
                showInFooter: true,
            }
        }
    },*/
    {
        path: '/privacy',
        element: typeof AboutUs === 'function' ? <AboutUs /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Privacy Policy',
            description: 'Our privacy policy',
            icon: null,
            nav: {
                label: 'Privacy Policy',
                group: 'legal',
                order: 2,
                showInNav: false,
                showInFooter: true,
            }
        }
    },
    {
        path: '/cookies',
        element: typeof AboutUs === 'function' ? <AboutUs /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Cookie Policy',
            description: 'Our cookie policy',
            icon: null,
            nav: {
                label: 'Cookie Policy',
                group: 'legal',
                order: 3,
                showInNav: false,
                showInFooter: true,
            }
        }
    },



];

export default routes;