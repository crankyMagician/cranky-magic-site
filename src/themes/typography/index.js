// src/themes/typography/index.js
import React from 'react';

// Import all typography styles
import spatialModsTypography from "./spatialTypograhpy";
import techStartupTypography from "./techStartupTypography";
import sunsetTypography from "./sunsetTypography";
import retroNeonTypography from "./retroNeonTypography";
import professionalTypography from "./professionalTypography";
import mintTypography from "./mintTypography";
import lightTypography from "./lightTypography";
import highContrastAccessibilityTypography from "./highContrastAccessibilityTypography";
import darkTypography from "./darkTypography";
import corporateMemphisTypography from "./corporateMemphisTypography";
import altTypography from "./altTypography";
import robotoTypography from "./robotoTypography"; // Add the new Roboto typography
import crankyMagicianTypography from "./crankyMagicianTypography";

// Import icons for typography selection
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CodeIcon from '@mui/icons-material/Code';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import GradientIcon from '@mui/icons-material/Gradient';
import BusinessIcon from '@mui/icons-material/Business';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import PaletteIcon from '@mui/icons-material/Palette';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FontDownloadIcon from '@mui/icons-material/FontDownload'; // Icon for Roboto

// Typography Registry
export const TYPOGRAPHY_REGISTRY = {
    cranky: {
        id: 'cranky',
        name: 'Cranky',
        description: 'Magical typography with mystical flair',
        typography: crankyMagicianTypography, // Make sure you have crankyTypography imported
        icon: React.createElement(AutoAwesomeIcon),
        category: 'magical',
        tags: ['magical', 'mystical', 'fantasy', 'enchanted']
    },
    spatial: {
        id: 'spatial',
        name: 'Spatial',
        description: 'Futuristic fonts with Orbitron headers and Inter body text',
        typography: spatialModsTypography,
        icon: React.createElement(AutoAwesomeIcon),
        category: 'futuristic',
        tags: ['futuristic', 'tech', 'orbitron', 'inter']
    },
    startup: {
        id: 'startup',
        name: 'Tech Startup',
        description: 'Modern tech fonts with Work Sans and Space Grotesk',
        typography: techStartupTypography,
        icon: React.createElement(CodeIcon),
        category: 'modern',
        tags: ['tech', 'startup', 'work-sans', 'space-grotesk']
    },
    professional: {
        id: 'professional',
        name: 'Professional',
        description: 'Business-appropriate fonts with Montserrat and Source Sans Pro',
        typography: professionalTypography,
        icon: React.createElement(BusinessIcon),
        category: 'business',
        tags: ['business', 'professional', 'montserrat', 'source-sans']
    },
    roboto: {
        id: 'roboto',
        name: 'Roboto Classic',
        description: 'Google\'s flagship font family - clean, modern, and highly readable',
        typography: robotoTypography,
        icon: React.createElement(FontDownloadIcon),
        category: 'modern',
        tags: ['roboto', 'google', 'clean', 'modern', 'readable']
    },
    memphis: {
        id: 'memphis',
        name: 'Corporate Memphis',
        description: 'Playful corporate fonts with Poppins and Roboto Slab',
        typography: corporateMemphisTypography,
        icon: React.createElement(PaletteIcon),
        category: 'playful',
        tags: ['corporate', 'memphis', 'poppins', 'roboto-slab']
    },
    alternative: {
        id: 'alternative',
        name: 'Alternative',
        description: 'Unique font combination with Roboto, Raleway, and Merriweather',
        typography: altTypography,
        icon: React.createElement(ColorLensIcon),
        category: 'unique',
        tags: ['alternative', 'roboto', 'raleway', 'merriweather']
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset',
        description: 'Warm and inviting fonts with Lobster and Open Sans',
        typography: sunsetTypography,
        icon: React.createElement(WbTwilightIcon),
        category: 'warm',
        tags: ['warm', 'sunset', 'lobster', 'open-sans']
    },
    mint: {
        id: 'mint',
        name: 'Mint',
        description: 'Fresh and clean fonts with Fira Sans and Bitter',
        typography: mintTypography,
        icon: React.createElement(FilterVintageIcon),
        category: 'fresh',
        tags: ['fresh', 'mint', 'fira-sans', 'bitter']
    },
    light: {
        id: 'light',
        name: 'Light & Airy',
        description: 'Light and readable fonts with Kanit and Sintony',
        typography: lightTypography,
        icon: React.createElement(LightbulbIcon),
        category: 'light',
        tags: ['light', 'airy', 'kanit', 'sintony']
    },
    dark: {
        id: 'dark',
        name: 'Dark & Bold',
        description: 'Strong contrast fonts with Oswald and Playfair Display',
        typography: darkTypography,
        icon: React.createElement(TextFieldsIcon),
        category: 'bold',
        tags: ['dark', 'bold', 'oswald', 'playfair']
    },
    retro: {
        id: 'retro',
        name: 'Retro Neon',
        description: 'Retro-inspired fonts with Righteous and Rajdhani',
        typography: retroNeonTypography,
        icon: React.createElement(GradientIcon),
        category: 'retro',
        tags: ['retro', 'neon', 'righteous', 'rajdhani']
    },
    accessible: {
        id: 'accessible',
        name: 'High Contrast',
        description: 'Highly readable fonts optimized for accessibility',
        typography: highContrastAccessibilityTypography,
        icon: React.createElement(SettingsBrightnessIcon),
        category: 'accessibility',
        tags: ['accessible', 'high-contrast', 'readable', 'open-sans']
    }
};

// Typography Helper Functions
export const getTypographyById = (typographyId) => {
    return TYPOGRAPHY_REGISTRY[typographyId] || null;
};

export const getAllTypographies = () => {
    return Object.values(TYPOGRAPHY_REGISTRY);
};

export const getTypographiesByCategory = (category) => {
    return Object.values(TYPOGRAPHY_REGISTRY).filter(typography => typography.category === category);
};

export const getTypographiesByTag = (tag) => {
    return Object.values(TYPOGRAPHY_REGISTRY).filter(typography => typography.tags.includes(tag));
};

export const getAvailableTypographyIds = () => {
    return Object.keys(TYPOGRAPHY_REGISTRY);
};

export const validateTypographyId = (typographyId) => {
    return Object.prototype.hasOwnProperty.call(TYPOGRAPHY_REGISTRY, typographyId);
};

// Get typography by ID
export const getTypographyStylesById = (typographyId) => {
    const typography = getTypographyById(typographyId);
    return typography ? typography.typography : spatialModsTypography; // fallback to spatial
};

export default TYPOGRAPHY_REGISTRY;