// src/themes/componentOverrides/index.js
import React from 'react';

// Import existing component overrides
import crankyComponentOverrides from '../muicomponents/crankyComponentOverrides';

// Import icons for component override selection
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ClassicIcon from '@mui/icons-material/AccountBalance';

// We'll create the other component overrides in subsequent steps
import cleanComponentOverrides from './cleanComponentOverrides';
import materialComponentOverrides from './materialComponentOverrides';
import classicComponentOverrides from './classicComponentOverrides';

// Component Override Registry
export const COMPONENT_OVERRIDE_REGISTRY = {
    cranky: {
        id: 'cranky',
        name: 'Futuristic',
        description: 'Futuristic styling with Matrix-inspired effects, glows, and high-tech aesthetics',
        overrides: crankyComponentOverrides,
        compatibleThemes: ['all'],
        icon: React.createElement(AutoFixHighIcon),
        preview: null,
        tags: ['futuristic', 'matrix', 'glow', 'high-tech']
    },
    clean: {
        id: 'clean',
        name: 'Clean',
        description: 'Minimal, clean styling with subtle shadows and modern design',
        overrides: cleanComponentOverrides,
        compatibleThemes: ['all'],
        icon: React.createElement(CleaningServicesIcon),
        preview: null,
        tags: ['minimal', 'clean', 'modern', 'subtle']
    },
    material: {
        id: 'material',
        name: 'Material Design',
        description: 'Pure Material Design components following Google\'s design guidelines',
        overrides: materialComponentOverrides,
        compatibleThemes: ['all'],
        icon: React.createElement(DesignServicesIcon),
        preview: null,
        tags: ['material', 'google', 'standard', 'guidelines']
    },
    classic: {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional styling with classic borders and conservative design',
        overrides: classicComponentOverrides,
        compatibleThemes: ['all'],
        icon: React.createElement(ClassicIcon),
        preview: null,
        tags: ['traditional', 'classic', 'conservative', 'borders']
    }
};

// Component Override Helper Functions
export const getComponentOverrideById = (overrideId) => {
    return COMPONENT_OVERRIDE_REGISTRY[overrideId] || null;
};

export const getAllComponentOverrides = () => {
    return Object.values(COMPONENT_OVERRIDE_REGISTRY);
};

export const getAvailableComponentOverrideIds = () => {
    return Object.keys(COMPONENT_OVERRIDE_REGISTRY);
};

export const validateComponentOverrideId = (overrideId) => {
    return Object.prototype.hasOwnProperty.call(COMPONENT_OVERRIDE_REGISTRY, overrideId);
};

export const getComponentOverridesForTheme = (themeId) => {
    return Object.values(COMPONENT_OVERRIDE_REGISTRY).filter(override =>
        override.compatibleThemes.includes('all') || override.compatibleThemes.includes(themeId)
    );
};

export const getComponentOverridesByTag = (tag) => {
    return Object.values(COMPONENT_OVERRIDE_REGISTRY).filter(override =>
        override.tags.includes(tag)
    );
};

// Get component overrides by ID
export const getComponentOverridesById = (overrideId) => {
    const override = getComponentOverrideById(overrideId);
    return override ? override.overrides : crankyComponentOverrides; // fallback to cranky
};

export default COMPONENT_OVERRIDE_REGISTRY;