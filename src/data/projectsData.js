/**
 * Real Portfolio Projects Data
 * Source: GitHub repositories - https://github.com/sam-redpath
 * Last updated: January 2026
 */

export const projectsData = [
  {
    id: 'spatial-mods-api',
    title: 'SpatialMods .NET API',
    description: 'Cross-platform .NET API for spatial modifications and game world management. Built with C# and modern cloud architecture.',
    longDescription: 'Developed a robust .NET API for managing spatial modifications in game environments. Implements RESTful endpoints with authentication, real-time updates, and cloud storage integration.',
    image: '/assets/images/projects/spatial-mods.png', // TODO: Screenshot needed
    technologies: ['C#', '.NET', 'Azure', 'Entity Framework', 'REST API'],
    category: 'backend',
    featured: true,
    githubUrl: 'https://github.com/sam-redpath/SpatialModsNetAPI',
    demoUrl: null, // Private/internal
    date: '2025',
    role: 'Lead Developer',
    stats: {
      commits: '100+',
      language: 'C#'
    }
  },
  {
    id: 'cranky-native-template',
    title: 'Cranky Native Template',
    description: 'Cross-platform React template using React Native Paper that works seamlessly on Android, iOS, and web with shared codebase.',
    longDescription: 'Created a production-ready React Native template with Native Paper UI components. Enables rapid development of cross-platform applications with a single codebase, complete with theming, navigation, and responsive design patterns.',
    image: '/assets/images/projects/cranky-native.png', // TODO: Screenshot needed
    technologies: ['React Native', 'JavaScript', 'React Native Paper', 'Expo', 'iOS', 'Android'],
    category: 'fullstack',
    featured: true,
    githubUrl: 'https://github.com/sam-redpath/cranky-native-template',
    demoUrl: null,
    date: '2025',
    role: 'Creator',
    stats: {
      platforms: '3 (Web, iOS, Android)',
      reusability: 'Single codebase'
    }
  },
  {
    id: 'react-pokemon-threejs',
    title: 'Pokémon 3D Visualization',
    description: 'Interactive 3D Pokémon visualization using React and Three.js. Features real-time rendering, animations, and responsive controls.',
    longDescription: 'Built an engaging 3D visualization application combining React with Three.js for WebGL rendering. Implements complex 3D transformations, lighting effects, and interactive controls for exploring Pokémon models in a browser environment.',
    image: '/assets/images/projects/pokemon-threejs.png', // TODO: Screenshot needed
    technologies: ['React', 'Three.js', 'JavaScript', 'WebGL', '3D Graphics'],
    category: 'frontend',
    featured: false,
    githubUrl: 'https://github.com/sam-redpath/react-pokemon-threejs',
    demoUrl: null,
    date: '2025',
    role: 'Developer'
  },
  {
    id: 'grant-scraper',
    title: 'Grant Python Scraper',
    description: 'Python application that downloads grants.gov XML data and uploads it to Azure SQL Database for analysis and tracking.',
    longDescription: 'Developed an automated scraping system for government grant data. Parses XML feeds, normalizes data, and stores in Azure SQL Database with proper error handling, logging, and scheduling capabilities.',
    image: '/assets/images/projects/grant-scraper.png', // TODO: Screenshot needed
    technologies: ['Python', 'Azure SQL', 'XML Parsing', 'Automation', 'Data Engineering'],
    category: 'backend',
    featured: false,
    githubUrl: 'https://github.com/sam-redpath/Grant_Python_Scraper',
    demoUrl: null,
    date: '2024',
    role: 'Developer',
    stats: {
      stars: '1',
      automatedRecords: 'Thousands'
    }
  },
  {
    id: 'blog-updater',
    title: 'Azure Blog CRUD System',
    description: 'Full-featured blog management system with CRUD operations, housed in Azure with C# backend.',
    longDescription: 'Architected and implemented a scalable blog management platform using C# and Azure services. Includes REST API, database management, authentication, and content versioning.',
    image: '/assets/images/projects/blog-updater.png', // TODO: Screenshot needed
    technologies: ['C#', 'Azure', 'SQL Server', 'REST API', 'Entity Framework'],
    category: 'fullstack',
    featured: false,
    githubUrl: 'https://github.com/sam-redpath/BlogUpdater',
    demoUrl: null,
    date: '2024',
    role: 'Solutions Architect'
  },
  {
    id: 'web-wanderer',
    title: 'WebWanderer Python Scraper',
    description: 'Universal Python web scraper capable of extracting data from any website with configurable selectors and export formats.',
    longDescription: 'Built a flexible web scraping framework in Python with support for dynamic content, pagination, rate limiting, and multiple export formats (JSON, CSV, Database).',
    image: '/assets/images/projects/web-wanderer.png', // TODO: Screenshot needed
    technologies: ['Python', 'BeautifulSoup', 'Selenium', 'Data Extraction', 'Automation'],
    category: 'backend',
    featured: false,
    githubUrl: 'https://github.com/sam-redpath/WebWanderer',
    demoUrl: null,
    date: '2024',
    role: 'Developer'
  }
];

/**
 * Filter projects by category
 * @param {Array} projects - Array of project objects
 * @param {string} category - Category filter ('all', 'frontend', 'backend', 'fullstack')
 * @returns {Array} Filtered projects
 */
export const filterProjectsByCategory = (projects, category) => {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
};

/**
 * Get featured projects
 * @param {Array} projects - Array of project objects
 * @returns {Array} Featured projects
 */
export const getFeaturedProjects = (projects) => {
  return projects.filter(project => project.featured);
};
