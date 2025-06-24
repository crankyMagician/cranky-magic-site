// Section IDs for navigation and tracking
export const PORTFOLIO_SECTIONS = {
    HERO: 'hero-section',
    SKILLS: 'skills-section',
    PROJECTS: 'projects-section',
    FRAMEWORKS: 'frameworks-section',
    TIMELINE: 'timeline-section',
    BLOG: 'blog-section',
    CONTACT: 'contact-section',
};

// Section Order for sequential navigation
export const SECTION_ORDER = [
    PORTFOLIO_SECTIONS.HERO,
    PORTFOLIO_SECTIONS.SKILLS,
    PORTFOLIO_SECTIONS.PROJECTS,
    PORTFOLIO_SECTIONS.FRAMEWORKS,
    PORTFOLIO_SECTIONS.TIMELINE,
    PORTFOLIO_SECTIONS.BLOG,
    PORTFOLIO_SECTIONS.CONTACT,
];

// Section Labels for UI display
export const SECTION_LABELS = {
    [PORTFOLIO_SECTIONS.HERO]: 'Home',
    [PORTFOLIO_SECTIONS.SKILLS]: 'Skills',
    [PORTFOLIO_SECTIONS.PROJECTS]: 'Projects',
    [PORTFOLIO_SECTIONS.FRAMEWORKS]: 'Tech Stack',
    [PORTFOLIO_SECTIONS.TIMELINE]: 'Experience',
    [PORTFOLIO_SECTIONS.BLOG]: 'Blog',
    [PORTFOLIO_SECTIONS.CONTACT]: 'Contact',
};

// Scroll Behavior Configuration
export const SCROLL_CONFIG = {
    SMOOTH_SCROLL_DURATION: 800,
    SCROLL_OFFSET: -80, // Account for fixed header
    SCROLL_THRESHOLD: 0.1, // 10% visibility to trigger animations
    DEBOUNCE_DELAY: 150,
    THROTTLE_DELAY: 100,
};

// Intersection Observer Configuration
export const INTERSECTION_CONFIG = {
    DEFAULT_THRESHOLD: 0.1,
    PROGRESSIVE_THRESHOLDS: [0, 0.25, 0.5, 0.75, 1],
    ROOT_MARGIN: '-50px 0px',
    HERO_ROOT_MARGIN: '0px 0px',
    CARD_ROOT_MARGIN: '-100px 0px',
};

// Animation Timing Configurations
export const ANIMATION_TIMING = {
    SECTION_STAGGER: 100,
    CARD_STAGGER: 50,
    HERO_SEQUENCE_DELAY: 200,
    INITIAL_DELAY: 300,
    EXIT_DURATION: 200,
};

// Responsive Breakpoints (aligned with MUI)
export const BREAKPOINTS = {
    XS: 0,
    SM: 600,
    MD: 900,
    LG: 1200,
    XL: 1536,
};

// Layout Constants
export const LAYOUT_CONFIG = {
    HEADER_HEIGHT: 64,
    HEADER_HEIGHT_MOBILE: 56,
    SECTION_PADDING: {
        XS: 4,
        SM: 6,
        MD: 8,
        LG: 10,
    },
    MAX_CONTENT_WIDTH: 1200,
    CARD_SPACING: 3,
    GRID_SPACING: 3,
};

// Theme Mode Constants
export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    THEME_PREFERENCE: 'portfolio-theme-preference',
    ANIMATION_PREFERENCE: 'portfolio-animation-preference',
    LANGUAGE_PREFERENCE: 'portfolio-language',
    VISITED_SECTIONS: 'portfolio-visited-sections',
    FORM_DRAFT: 'portfolio-contact-form-draft',
};

// Analytics Event Names
export const ANALYTICS_EVENTS = {
    // Page View Events
    PAGE_VIEW: 'portfolio_page_view',
    SECTION_VIEW: 'portfolio_section_view',

    // Interaction Events
    NAVIGATION_CLICK: 'portfolio_nav_click',
    CTA_CLICK: 'portfolio_cta_click',
    SOCIAL_LINK_CLICK: 'portfolio_social_click',
    PROJECT_CARD_CLICK: 'portfolio_project_click',
    SKILL_CARD_HOVER: 'portfolio_skill_hover',

    // Form Events
    CONTACT_FORM_START: 'portfolio_contact_start',
    CONTACT_FORM_SUBMIT: 'portfolio_contact_submit',
    CONTACT_FORM_ERROR: 'portfolio_contact_error',

    // Theme Events
    THEME_TOGGLE: 'portfolio_theme_toggle',

    // Performance Events
    ANIMATION_COMPLETE: 'portfolio_animation_complete',
    SECTION_LOADED: 'portfolio_section_loaded',
};

// Performance Metrics
export const PERFORMANCE_METRICS = {
    FCP_THRESHOLD: 2000, // First Contentful Paint
    LCP_THRESHOLD: 2500, // Largest Contentful Paint
    FID_THRESHOLD: 100, // First Input Delay
    CLS_THRESHOLD: 0.1, // Cumulative Layout Shift
};

// Form Validation Rules
export const VALIDATION_RULES = {
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
        PATTERN: /^[a-zA-Z\s'-]+$/,
    },
    EMAIL: {
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MAX_LENGTH: 100,
    },
    MESSAGE: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 1000,
    },
};

// API Endpoints
export const API_ENDPOINTS = {
    CONTACT_FORM: '/api/contact',
    ANALYTICS: '/api/analytics',
    BLOG_POSTS: '/api/blog/posts',
    PROJECTS: '/api/projects',
};

// External Links
export const EXTERNAL_LINKS = {
    GITHUB: 'https://github.com',
    LINKEDIN: 'https://linkedin.com',
    TWITTER: 'https://twitter.com',
    RESUME: '/resume.pdf',
};

// Asset Paths
export const ASSET_PATHS = {
    IMAGES: '/assets/images',
    ICONS: '/assets/icons',
    VIDEOS: '/assets/videos',
    DOCUMENTS: '/assets/documents',
};

// Error Messages
export const ERROR_MESSAGES = {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    FORM_VALIDATION: 'Please check your input and try again.',
    CONTACT_FORM_FAILED: 'Failed to send message. Please try again later.',
    CONTENT_LOAD_FAILED: 'Failed to load content. Please refresh the page.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    CONTACT_FORM_SENT: 'Thank you! Your message has been sent successfully.',
    COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
    THEME_CHANGED: 'Theme updated successfully.',
};

// SEO Metadata
export const SEO_CONFIG = {
    TITLE_TEMPLATE: '%s | Portfolio',
    DEFAULT_TITLE: 'Full Stack Developer Portfolio',
    DEFAULT_DESCRIPTION: 'Experienced full stack developer specializing in React, Node.js, and cloud technologies.',
    DEFAULT_KEYWORDS: ['developer', 'portfolio', 'react', 'full stack', 'software engineer'],
    DEFAULT_OG_IMAGE: '/og-image.jpg',
    TWITTER_HANDLE: '@username',
};

// Feature Flags
export const FEATURE_FLAGS = {
    ENABLE_ANALYTICS: true,
    ENABLE_ANIMATIONS: true,
    ENABLE_BLOG_SECTION: true,
    ENABLE_DARK_MODE: true,
    ENABLE_CONTACT_FORM: true,
    ENABLE_SOCIAL_LINKS: true,
    ENABLE_RESUME_DOWNLOAD: true,
};

// Content Limits
export const CONTENT_LIMITS = {
    MAX_PROJECTS_DISPLAY: 6,
    MAX_SKILLS_DISPLAY: 12,
    MAX_BLOG_POSTS_DISPLAY: 3,
    MAX_TIMELINE_ITEMS: 5,
    MAX_TESTIMONIALS: 4,
};

// Z-Index Layers
export const Z_INDEX = {
    BACKGROUND: -1,
    DEFAULT: 0,
    CARD: 10,
    DROPDOWN: 100,
    STICKY: 200,
    FIXED: 300,
    MODAL_BACKDROP: 400,
    MODAL: 500,
    POPOVER: 600,
    TOOLTIP: 700,
    TOAST: 800,
    LOADING: 900,
};

// Accessibility Constants
export const A11Y_CONFIG = {
    SKIP_LINK_TARGET: '#main-content',
    FOCUS_VISIBLE_OUTLINE: '2px solid',
    MIN_TOUCH_TARGET: 44,
    REDUCED_MOTION_QUERY: '(prefers-reduced-motion: reduce)',
    HIGH_CONTRAST_QUERY: '(prefers-contrast: high)',
};