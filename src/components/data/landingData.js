/**
 * Landing Page Data
 *
 * Data arrays for the landing page components.
 * These can be imported and used with section components.
 *
 * @example
 * import { features, bestPractices, newsItems } from '../components/data/landingData';
 */

// Import images
import autoPoster from '../../assets/hero/geometric_hero.png';
import familyFun from '../../assets/hero/geometric_hero_1.png';
import spacePoster from '../../assets/hero/geometric_hero_2.png';

/**
 * Feature cards data for FeaturesGrid
 * logoPosition: 'left' | 'right' | 'full' | 'none' - controls the portal logo overlay
 */
export const features = [
    {
        title: 'Make Every Image An Event',
        body: 'Turn ordinary into extraordinary. Launch immersive campaigns in seconds and capture attention with novelty.',
        cta: 'See Auto Show',
        image: autoPoster,
        logoPosition: 'full',
    },
    {
        title: 'Make Every Memory Eternal',
        body: 'Honor stories and cherished memories with digital keepsakes your audience can access anywhere.',
        cta: 'See Family Fun',
        image: familyFun,
        logoPosition: 'full',
    },
    {
        title: 'Once Was Old Is Made New',
        body: 'Re-imagine legacy systems and modernize infrastructure with cloud-native solutions and modern architecture.',
        cta: 'See Space Poster',
        image: spacePoster,
        logoPosition: 'full',
    },
];

/**
 * Best practices data for PracticesGrid
 */
export const bestPractices = [
    {
        title: 'Standardize',
        body: 'Standardizing visual elements provides a clear representation of expected content, which improves audience engagement.',
        cta: 'Learn More',
    },
    {
        title: 'Creators',
        body: 'Creators and teams have powerful tools to build, deploy, and scale applications with modern development practices.',
        cta: 'For Creators',
    },
    {
        title: 'Deployment',
        body: 'With the right technical approach, you can effectively deploy your media assets in a truly novel and engaging experience.',
        cta: 'Deploy Now',
    },
    {
        title: 'Video Production',
        body: 'A step-by-step guide on how to use video editing to create stunning visual projects.',
        cta: 'View Guide',
    },
    {
        title: 'Existing Content',
        body: 'A guide on how to use your existing media content to create engaging experiences with simple editing.',
        cta: 'Use Your Content',
    },
    {
        title: 'Events & Marketing',
        body: 'Modern solutions level the playing field by lowering the barriers of entry for digital engagement.',
        cta: 'Learn More',
    },
];

/**
 * News items data for NewsGrid
 */
export const newsItems = [
    {
        title: 'The 7 mistakes to avoid when building your website',
        category: 'Business, Technology',
        date: '5 March 2025',
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80',
        excerpt: 'Learn from common mistakes and build a better website for your campaigns.',
    },
    {
        title: 'How to launch your online business in 24 hours',
        category: 'Technology',
        date: '25 February 2025',
        image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
        excerpt: 'Quick tips for getting your business online and ready for growth.',
    },
    {
        title: 'Minimalism & design: why a clean layout makes all the difference',
        category: 'Growth, News',
        date: '15 February 2025',
        image: 'https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=800&q=80',
        excerpt: 'Discover how clean design principles enhance user experiences.',
    },
];
