/**
 * Real Portfolio Contact Information
 * Social links, email, and API configuration
 * Last updated: January 2026
 */

export const contactInfo = {
  email: 'brian.s.redpath@gmail.com',
  location: 'Inglewood, CA',
  github: 'https://github.com/sam-redpath',
  linkedin: 'https://www.linkedin.com/in/sam-redpath',
};

export const socialLinks = [
  {
    platform: 'GitHub',
    url: 'https://github.com/sam-redpath',
    icon: 'GitHubIcon',
    display: true
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sam-redpath',
    icon: 'LinkedInIcon',
    display: true
  }
];

// Cranky-Commo API Configuration
export const emailApiConfig = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  endpoint: '/portfolio/contact',
  rateLimit: {
    requests: 5,
    windowMinutes: 15
  }
};

/**
 * Get display email for UI
 * @returns {string} Email address
 */
export const getDisplayEmail = () => {
  return contactInfo.email;
};

/**
 * Get mailto link
 * @returns {string} mailto: link
 */
export const getEmailLink = () => {
  return `mailto:${contactInfo.email}`;
};

/**
 * Get active social links
 * @returns {Array} Array of active social links
 */
export const getActiveSocialLinks = () => {
  return socialLinks.filter(link => link.display);
};
