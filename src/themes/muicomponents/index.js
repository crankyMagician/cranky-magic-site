// src/themes/muicomponents/index.js
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GridOnIcon from '@mui/icons-material/GridOn';
import BoltIcon from '@mui/icons-material/Bolt';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SpaIcon from '@mui/icons-material/Spa';
import CodeIcon from '@mui/icons-material/Code';

// Import all component overrides
import defaultComponentOverrides from './defaultComponentOverrides';
import crankyComponentOverrides from './crankyComponentOverrides';
import wizardComponentOverrides from './wizardComponentOverrides';
import cleanComponentOverrides from './cleanComponentOverrides';
import lightningComponentOverrides from './lightningComponentOverrides';
import classicComponentOverrides from './classicComponentOverrides';
import minimalComponentOverrides from './minimalComponentOverrides';
import developerComponentOverrides from './developerComponentOverrides';

// Component override registry
const componentOverrideRegistry = {
    default: {
        id: 'default',
        name: 'Default',
        description: 'Standard Material UI components',
        icon: <GridOnIcon />,
        overrides: defaultComponentOverrides,
        isPremium: false,
    },
    cranky: {
        id: 'cranky',
        name: 'Cranky Magic',
        description: 'Magical and mystical UI with enchanting effects',
        icon: <AutoAwesomeIcon />,
        overrides: crankyComponentOverrides,
        isPremium: true,
    },
    wizard: {
        id: 'wizard',
        name: 'Wizard Extended',
        description: 'Extended magical components with advanced animations',
        icon: <AutoAwesomeIcon />,
        overrides: wizardComponentOverrides,
        isPremium: true,
    },
    clean: {
        id: 'clean',
        name: 'Clean',
        description: 'Clean and modern design with subtle shadows',
        icon: <GridOnIcon />,
        overrides: cleanComponentOverrides,
        isPremium: false,
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Minimalist design with focus on content',
        icon: <SpaIcon />,
        overrides: minimalComponentOverrides,
        isPremium: false,
    },
    developer: {
        id: 'developer',
        name: 'Developer',
        description: 'Code editor and terminal inspired theme',
        icon: <CodeIcon />,
        overrides: developerComponentOverrides,
        isPremium: true,
    },
    lightning: {
        id: 'lightning',
        name: 'Lightning',
        description: 'Electric and energetic UI with dynamic effects',
        icon: <BoltIcon />,
        overrides: lightningComponentOverrides,
        isPremium: true,
    },
    classic: {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional and professional appearance',
        icon: <DesignServicesIcon />,
        overrides: classicComponentOverrides,
        isPremium: false,
    },
};

// Get all available component override IDs
export const getAvailableComponentOverrideIds = () => {
    return Object.keys(componentOverrideRegistry);
};

// Validate a component override ID
export const validateComponentOverrideId = (overrideId) => {
    return componentOverrideRegistry.hasOwnProperty(overrideId);
};

// Get component override by ID
export const getComponentOverrideById = (overrideId) => {
    if (!validateComponentOverrideId(overrideId)) {
        console.warn(`Invalid component override ID: ${overrideId}. Using default.`);
        return componentOverrideRegistry.default.overrides;
    }
    return componentOverrideRegistry[overrideId].overrides;
};

/**
 * Resolve a pack into a plain components object.
 *
 * Nine packs export an object; the wizard pack exports `(theme) => ({ ... })`. That
 * function was being handed straight to createTheme, which expects an object, so the
 * whole wizard pack applied nothing. Calling it here revives it without rewriting 669
 * lines, and a pack that throws degrades to no overrides rather than taking the page down.
 */
export const resolveComponentOverrides = (overrides, theme) => {
    if (typeof overrides !== 'function') return overrides || {};
    try {
        return overrides(theme) || {};
    } catch (e) {
        console.warn('Component override pack failed to resolve:', e.message);
        return {};
    }
};

// Get all component overrides (for UI selection)
export const getAllComponentOverrides = () => {
    return Object.values(componentOverrideRegistry);
};

// Get component override info
export const getComponentOverrideInfo = (overrideId) => {
    if (!validateComponentOverrideId(overrideId)) {
        return componentOverrideRegistry.default;
    }
    return componentOverrideRegistry[overrideId];
};

// Export individual overrides for backward compatibility
export {
    defaultComponentOverrides,
    crankyComponentOverrides,
    wizardComponentOverrides,
    cleanComponentOverrides,
    lightningComponentOverrides,
    classicComponentOverrides,
    minimalComponentOverrides,
    developerComponentOverrides,
};