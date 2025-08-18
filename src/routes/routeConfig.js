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
import BusinessSignupPage from '../pages/BusinessSignupPage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import SpatialDemoPanel from '../components/demo/SpatialDemoPanel';
import CampaignManagementPage from "../pages/CampaignManagementPage";
import InvitationLanding from "../components/business/InvitationLanding";
import BusinessUsersPage from "../pages/BusinessUsersPage";
import BusinessRolesPage from "../pages/BusinessRolesPage";

// Add console logging to verify each component is a function
console.log('Component types check:');
console.log('Example:', typeof Example);

console.log('AboutUs:', typeof AboutUs);
console.log('StreamVideo:', typeof StreamVideo);
console.log('Calendar:', typeof Calendar);

console.log('BusinessSignupPage:', typeof BusinessSignupPage);
console.log('LoginPage:', typeof LoginPage);
console.log('ForgotPasswordPage:', typeof ForgotPasswordPage);
console.log('ChangePasswordPage:', typeof ChangePasswordPage);
console.log('SpatialDemoPanel:', typeof SpatialDemoPanel);
console.log('CampaignManagementPage:', typeof CampaignManagementPage);

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
    {
        path: '/spatial-mods',
        element: typeof SpatialDemoPanel === 'function' ? <SpatialDemoPanel /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Spatial Demo',
            description: 'Spatial effects demonstration',
            icon: <DashboardIcon />,
            nav: {
                label: 'Spatial Demo',
                group: 'demo',
                order: 1,
                showInNav: false,
                showInFooter: false,
            }
        }
    },

    // Campaign Management Route
    {
        path: '/campaigns',
        element: typeof CampaignManagementPage === 'function' ? <CampaignManagementPage /> : <FallbackComponent />,
        exact: true,
        auth: true, // Requires authentication
        meta: {
            title: 'Campaign Management',
            description: 'Create and manage your marketing campaigns',
            icon: <CampaignIcon />,
            nav: {
                label: 'Campaigns',
                group: 'main',
                order: 3,
                showInNav: true,
                showInFooter: false,
            }
        }
    },
    // Authentication & Account routes
    {
        path: '/login',
        element: typeof LoginPage === 'function' ? <LoginPage /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Login',
            description: 'Login to your account',
            icon: null,
            nav: {
                label: 'Login',
                group: 'auth',
                order: 1,
                showInNav: false,
                showInFooter: false,
            }
        }
    },
    {
        path: '/forgot-password',
        element: typeof ForgotPasswordPage === 'function' ? <ForgotPasswordPage /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Forgot Password',
            description: 'Reset your password',
            icon: null,
            nav: {
                label: 'Forgot Password',
                group: 'auth',
                order: 2,
                showInNav: false,
                showInFooter: false,
            }
        }
    },
    {
        path: '/change-password',
        element: typeof ChangePasswordPage === 'function' ? <ChangePasswordPage /> : <FallbackComponent />,
        exact: true,
        auth: true,
        meta: {
            title: 'Change Password',
            description: 'Change your account password',
            icon: null,
            nav: {
                label: 'Change Password',
                group: 'auth',
                order: 3,
                showInNav: false,
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
    {
        path: '/business-signup',
        element: typeof BusinessSignupPage === 'function' ? <BusinessSignupPage /> : <FallbackComponent />,
        exact: true,
        auth: false,
        meta: {
            title: 'Business Signup',
            description: 'Create a business account',
            icon: <Business />,
            nav: {
                label: 'Business Signup',
                group: 'auth',
                order: 4,
                showInNav: false,
                showInFooter: false,
            }
        }
    },
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
    // Business Users Management
    {
        path: '/business-users',
        element: typeof BusinessUsersPage === 'function' ? <BusinessUsersPage /> : <FallbackComponent />,
        exact: true,
        auth: true, // Requires authentication
        meta: {
            title: 'Business Users',
            description: 'Manage business users and invitations',
            icon: <PeopleIcon />,
            nav: {
                label: 'Users',
                group: 'company',
                order: 2,
                showInNav: true,
                showInFooter: false,
            }
        }
    },

    // Business Roles Management
    {
        path: '/business-roles',
        element: typeof BusinessRolesPage === 'function' ? <BusinessRolesPage /> : <FallbackComponent />,
        exact: true,
        auth: true, // Requires authentication
        meta: {
            title: 'Business Roles',
            description: 'Manage business roles and permissions',
            icon: <SecurityIcon />,
            nav: {
                label: 'Roles & Permissions',
                group: 'company',
                order: 3,
                showInNav: true,
                showInFooter: false,
            }
        }
    },

    // Invitation Landing Page (public)
    {
        path: '/invitation',
        element: typeof InvitationLanding === 'function' ? <InvitationLanding /> : <FallbackComponent />,
        exact: true,
        auth: false, // Public route
        meta: {
            title: 'Business Invitation',
            description: 'Accept a business invitation',
            icon: <EmailIcon />,
            nav: {
                label: 'Accept Invitation',
                group: 'auth',
                order: 5,
                showInNav: false,
                showInFooter: false,
            }
        }
    },
];

export default routes;