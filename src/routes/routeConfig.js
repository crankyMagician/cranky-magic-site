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
    Business
} from '@mui/icons-material';

// Page components - Replace with actual imports
import Example from '../example/Example';
import AccountSettingsPage from '../components/demoComponents/AccountSettingsPage';
import ContactUs from '../components/common/ContactUsComponent';
import NewsletterSignup from '../components/demoComponents/NewsletterSignup';
import AboutUs from '../components/common/AboutUs';
import StreamVideo from '../components/demoComponents/StreamVideo';
import Calendar from '../components/demoComponents/Calendar';
import LandingPage from '../components/demoComponents/LandingPage';
import BusinessSignupPage from '../pages/BusinessSignupPage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import SpatialDemoPanel from '../components/demo/SpatialDemoPanel';

/**
 * Application route configuration
 * This is the master list of all routes in the application
 *
 * Each route contains:
 * - path: URL path
 * - component: React component to render
 * - exact: Whether the path needs exact matching
 * - auth: Authentication requirements (true = authentication required)
 * - roles: Array of allowed roles (empty = all roles allowed)
 * - meta: Additional metadata about the route
 *   - title: Page title (for SEO and browser title)
 *   - description: Page description
 *   - icon: Material-UI icon component
 *   - nav: Navigation display settings
 *     - label: Text to show in navigation
 *     - group: Navigation group this belongs to
 *     - order: Display order within group
 *     - showInNav: Whether to display in navigation components
 *     - showInFooter: Whether to display in footer
 */
const routes = [
    // Main/Dashboard pages
    {
        path: '/',
        component: Example,
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
        component: Example,
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
        component: SpatialDemoPanel,
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

    // Authentication & Account routes
    {
        path: '/login',
        component: LoginPage,
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
        component: ForgotPasswordPage,
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
        component: ChangePasswordPage,
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
    {
        path: '/edit-account',
        component: AccountSettingsPage,
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
    },
    {
        path: '/business-signup',
        component: BusinessSignupPage,
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

    // Content pages
    {
        path: '/about-us',
        component: AboutUs,
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
    {
        path: '/contact-us',
        component: ContactUs,
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
    },
    {
        path: '/newsletter-signup',
        component: NewsletterSignup,
        exact: true,
        auth: false,
        meta: {
            title: 'Newsletter Signup',
            description: 'Subscribe to our newsletter',
            icon: <Email />,
            nav: {
                label: 'Newsletter',
                group: 'community',
                order: 1,
                showInNav: true,
                showInFooter: true,
            }
        }
    },
    {
        path: '/video-stream',
        component: StreamVideo,
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
        component: Calendar,
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
    },

    // Legal pages
    {
        path: '/terms',
        component: AboutUs, // Just using AboutUs as a placeholder
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
    },
    {
        path: '/privacy',
        component: AboutUs, // Just using AboutUs as a placeholder
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
        component: AboutUs, // Just using AboutUs as a placeholder
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