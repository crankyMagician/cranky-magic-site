// src/themes/themeRegistry.js
import React from 'react';

// Import all palettes
import { spatialModsLight } from "./palettes/spatialModsLight";
import { spatialModsDark } from "./palettes/spatialModsDark";
import { paletteLightMode } from "./palettes/paletteLightMode";
import { paletteDarkMode } from "./palettes/paletteDarkMode";
import { professionalModernPalette } from "./palettes/professionalModernPalette";
import { techStartupInnovationPalette } from "./palettes/techStartupInnovationPalette";
import { corporateMemphisPalette } from "./palettes/corporateMemphisPalette";
import { altThemePalette } from "./palettes/altThemePalette";
import { sunsetPalette } from "./palettes/sunsetPalette";
import { mintPalette } from "./palettes/mintPalette";
import { retroNeonPalette } from "./palettes/retroNeonPalette";
import { highContrastPalette } from "./palettes/highContrastPalette";
import { csColor27V1 } from "./spatialcolor/cs_color_27_v1";
import { csColor30V2 } from "./spatialcolor/cs_color_30_v2";
import { csColor23V3 } from "./spatialcolor/cs_color_23_v3";
import { csColor29V4 } from "./spatialcolor/cs_color_29_v4";
import { csColor31V5 } from "./spatialcolor/cs_color_31_v5";
// Import Cranky Magician palettes
import { crankyMagicianDark } from "./palettes/crankyMagicianDark";
import { crankyMagicianLight } from "./palettes/crankyMagicianLight";
// Import Professional Dark palette
import { professionalDarkPalette } from "./palettes/professionalDarkPalette";

// Import all typography
import spatialModsTypography from "./typography/spatialTypograhpy";
import techStartupTypography from "./typography/techStartupTypography";
import sunsetTypography from "./typography/sunsetTypography";
import retroNeonTypography from "./typography/retroNeonTypography";
import professionalTypography from "./typography/professionalTypography";
import mintTypography from "./typography/mintTypography";
import lightTypography from "./typography/lightTypography";
import highContrastAccessibilityTypography from "./typography/highContrastAccessibilityTypography";
import darkTypography from "./typography/darkTypography";
import corporateMemphisTypography from "./typography/corporateMemphisTypography";
import altTypography from "./typography/altTypography";
// Import Cranky Magician typography
import crankyMagicianTypography from "./typography/crankyMagicianTypography";

// Import icons for theme selection
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';
import BusinessIcon from '@mui/icons-material/Business';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GradientIcon from '@mui/icons-material/Gradient';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import StarsIcon from '@mui/icons-material/Stars';

// Central Theme Registry
export const THEME_REGISTRY = {
    // Cranky Magician themes (placed first for priority)
    cranky_dark: {
        id: 'cranky_dark',
        name: 'Cranky Magician Dark',
        category: 'dark',
        palette: crankyMagicianDark,
        typography: crankyMagicianTypography,
        defaultComponentOverride: 'wizard',
        icon: React.createElement(AutoFixHighIcon),
        description: 'Mystical dark theme with wizard-inspired colors and magical effects',
        isNew: true,
        tags: ['magical', 'wizard', 'dark', 'cranky', 'mystical']
    },
    cranky_light: {
        id: 'cranky_light',
        name: 'Cranky Magician Light',
        category: 'light',
        palette: crankyMagicianLight,
        typography: crankyMagicianTypography,
        defaultComponentOverride: 'wizard',
        icon: React.createElement(StarsIcon),
        description: 'Mystical light theme with wizard-inspired colors and magical effects',
        isNew: true,
        tags: ['magical', 'wizard', 'light', 'cranky', 'mystical']
    },
    light: {
        id: 'light',
        name: 'Light',
        category: 'light',
        palette: spatialModsLight,
        typography: spatialModsTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(LightModeIcon),
        description: 'Clean spatial light theme with futuristic elements',
        isNew: false,
        tags: ['spatial', 'clean', 'futuristic']
    },
    dark: {
        id: 'dark',
        name: 'Dark',
        category: 'dark',
        palette: spatialModsDark,
        typography: spatialModsTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(DarkModeIcon),
        description: 'Dark spatial theme with Matrix-inspired elements',
        isNew: false,
        tags: ['spatial', 'dark', 'matrix', 'futuristic']
    },
    munchie: {
        id: 'munchie',
        name: 'Munchie',
        category: 'light',
        palette: paletteLightMode,
        typography: lightTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(LightbulbIcon),
        description: 'Bright and cheerful light theme',
        isNew: false,
        tags: ['cheerful', 'bright', 'casual']
    },
    munchie_dark: {
        id: 'munchie_dark',
        name: 'Munchie Dark',
        category: 'dark',
        palette: paletteDarkMode,
        typography: darkTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(LightbulbIcon),
        description: 'Dark version of the cheerful munchie theme',
        isNew: false,
        tags: ['cheerful', 'dark', 'casual']
    },
    professional: {
        id: 'professional',
        name: 'Professional',
        category: 'light',
        palette: professionalModernPalette,
        typography: professionalTypography,
        defaultComponentOverride: 'clean',
        icon: React.createElement(BusinessIcon),
        description: 'Clean, professional theme for business applications',
        isNew: false,
        tags: ['business', 'professional', 'clean']
    },
    professional_dark: {
        id: 'professional_dark',
        name: 'Professional Dark',
        category: 'dark',
        palette: professionalDarkPalette,
        typography: professionalTypography,
        defaultComponentOverride: 'clean',
        icon: React.createElement(BusinessIcon),
        description: 'Sophisticated dark theme with teal accents for professional applications',
        isNew: true,
        tags: ['business', 'professional', 'dark', 'teal', 'modern']
    },
    startup: {
        id: 'startup',
        name: 'Startup',
        category: 'light',
        palette: techStartupInnovationPalette,
        typography: techStartupTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(CodeIcon),
        description: 'Modern tech startup theme with innovative flair',
        isNew: false,
        tags: ['tech', 'startup', 'innovative']
    },
    memphis: {
        id: 'memphis',
        name: 'Corporate Memphis',
        category: 'light',
        palette: corporateMemphisPalette,
        typography: corporateMemphisTypography,
        defaultComponentOverride: 'clean',
        icon: React.createElement(PaletteIcon),
        description: 'Corporate Memphis design style theme',
        isNew: false,
        tags: ['corporate', 'memphis', 'colorful']
    },
    altTheme: {
        id: 'altTheme',
        name: 'Alternative',
        category: 'light',
        palette: altThemePalette,
        typography: altTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(ColorLensIcon),
        description: 'Alternative color scheme with unique styling',
        isNew: false,
        tags: ['alternative', 'unique', 'colorful']
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset',
        category: 'light',
        palette: sunsetPalette,
        typography: sunsetTypography,
        defaultComponentOverride: 'clean',
        icon: React.createElement(WbTwilightIcon),
        description: 'Warm sunset-inspired color theme',
        isNew: false,
        tags: ['warm', 'sunset', 'gradient']
    },
    mint: {
        id: 'mint',
        name: 'Mint',
        category: 'light',
        palette: mintPalette,
        typography: mintTypography,
        defaultComponentOverride: 'clean',
        icon: React.createElement(FilterVintageIcon),
        description: 'Fresh mint green theme',
        isNew: false,
        tags: ['fresh', 'mint', 'green']
    },
    retro_neon: {
        id: 'retro_neon',
        name: 'Retro Neon',
        category: 'dark',
        palette: retroNeonPalette,
        typography: retroNeonTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(GradientIcon),
        description: 'Vibrant retro neon theme with 80s aesthetics',
        isNew: false,
        tags: ['retro', 'neon', '80s', 'vibrant']
    },
    high_contrast: {
        id: 'high_contrast',
        name: 'High Contrast',
        category: 'light',
        palette: highContrastPalette,
        typography: highContrastAccessibilityTypography,
        defaultComponentOverride: 'clean',
        icon: React.createElement(SettingsBrightnessIcon),
        description: 'High contrast theme for accessibility',
        isNew: false,
        tags: ['accessibility', 'high-contrast', 'readable']
    },
    cs_color_27_v1: {
        id: 'cs_color_27_v1',
        name: 'CS Color V1',
        category: 'light',
        palette: csColor27V1,
        typography: spatialModsTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(AutoAwesomeIcon),
        description: 'Custom color scheme V1',
        isNew: true,
        tags: ['custom', 'christopher', 'purple']
    },
    cs_color_30_v2: {
        id: 'cs_color_30_v2',
        name: 'CS Color V2',
        category: 'dark',
        palette: csColor30V2,
        typography: spatialModsTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(AutoAwesomeIcon),
        description: 'Custom color scheme V2',
        isNew: true,
        tags: ['custom', 'christopher', 'dark']
    },
    cs_color_23_v3: {
        id: 'cs_color_23_v3',
        name: 'CS Color V3',
        category: 'light',
        palette: csColor23V3,
        typography: spatialModsTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(AutoAwesomeIcon),
        description: 'Custom color scheme V3',
        isNew: true,
        tags: ['custom', 'christopher', 'warm']
    },
    cs_color_29_v4: {
        id: 'cs_color_29_v4',
        name: 'CS Color V4',
        category: 'dark',
        palette: csColor29V4,
        typography: spatialModsTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(AutoAwesomeIcon),
        description: 'Custom color scheme V4',
        isNew: true,
        tags: ['custom', 'christopher', 'teal']
    },
    cs_color_31_v5: {
        id: 'cs_color_31_v5',
        name: 'CS Color V5',
        category: 'light',
        palette: csColor31V5,
        typography: spatialModsTypography,
        defaultComponentOverride: 'cranky',
        icon: React.createElement(AutoAwesomeIcon),
        description: 'Custom color scheme V5',
        isNew: true,
        tags: ['custom', 'christopher', 'purple']
    }
};

// Theme Registry Helper Functions
export const getThemeById = (themeId) => {
    return THEME_REGISTRY[themeId] || null;
};

export const getAllThemes = () => {
    return Object.values(THEME_REGISTRY);
};

export const getThemesByCategory = (category) => {
    return Object.values(THEME_REGISTRY).filter(theme => theme.category === category);
};

export const getThemesByTag = (tag) => {
    return Object.values(THEME_REGISTRY).filter(theme => theme.tags.includes(tag));
};

export const getAvailableThemeIds = () => {
    return Object.keys(THEME_REGISTRY);
};

export const validateThemeId = (themeId) => {
    return Object.prototype.hasOwnProperty.call(THEME_REGISTRY, themeId);
};

export const isDarkTheme = (themeId) => {
    const theme = getThemeById(themeId);
    return theme ? theme.category === 'dark' : false;
};

export const isSpatialTheme = (themeId) => {
    return themeId === 'light' || themeId === 'dark';
};

export const isCrankyMagicianTheme = (themeId) => {
    return themeId === 'cranky_light' || themeId === 'cranky_dark';
};

export const isDarkThemeMode = (themeId) => {
    const darkThemes = ['dark', 'cranky_dark', 'munchie_dark', 'retro_neon', 'cs_color_30_v2', 'cs_color_29_v4', 'professional_dark'];
    return darkThemes.includes(themeId);
};

// Get palette by theme ID
export const getPaletteByThemeId = (themeId) => {
    const theme = getThemeById(themeId);
    return theme ? theme.palette : spatialModsLight; // fallback to light
};

// Get typography by theme ID
export const getTypographyByThemeId = (themeId) => {
    const theme = getThemeById(themeId);
    return theme ? theme.typography : spatialModsTypography; // fallback to spatial
};

// Get default component override for theme
export const getDefaultComponentOverride = (themeId) => {
    const theme = getThemeById(themeId);
    return theme ? theme.defaultComponentOverride : 'cranky'; // fallback to cranky
};

// Legacy compatibility functions (for gradual migration)
export const getPaletteByMode = (mode) => {
    return getPaletteByThemeId(mode);
};

export const getTypographyByMode = (mode) => {
    return getTypographyByThemeId(mode);
};

export default THEME_REGISTRY;