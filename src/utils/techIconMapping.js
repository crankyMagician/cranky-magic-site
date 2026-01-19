// Technology Icon Mapping Utility
// Maps technology strings to react-icons components with their brand colors

import {
    SiReact,
    SiJavascript,
    SiTypescript,
    SiPython,
    SiDotnet,
    SiNodedotjs,
    SiExpress,
    SiDocker,
    SiKubernetes,
    SiAmazonwebservices,
    SiGooglecloud,
    SiMongodb,
    SiPostgresql,
    SiMysql,
    SiRedis,
    SiGraphql,
    SiApollographql,
    SiFirebase,
    SiTailwindcss,
    SiMui,
    SiSass,
    SiCss3,
    SiHtml5,
    SiGit,
    SiGithub,
    SiJest,
    SiWebpack,
    SiVite,
    SiNextdotjs,
    SiVercel,
    SiNetlify,
    SiNginx,
    SiLinux,
    SiTerraform,
    SiAnsible,
    SiJenkins,
    SiGitlab,
    SiPrisma,
    SiElasticsearch,
    SiRabbitmq,
    SiApachekafka,
    SiSwagger,
    SiFigma,
    SiJira,
    SiConfluence,
    SiSlack,
    SiIntellijidea,
    SiAndroid,
    SiIos,
    SiFlutter,
    SiSwift,
    SiKotlin,
    SiRust,
    SiGo,
    SiCplusplus,
    SiPhp,
    SiLaravel,
    SiDjango,
    SiFastapi,
    SiFlask,
    SiSpring,
    SiAngular,
    SiVuedotjs,
    SiSvelte,
    SiRedux,
    SiMobx,
    SiStorybook,
    SiCypress,
    SiSelenium,
    SiPrometheus,
    SiGrafana,
    SiDatadog,
    SiSentry,
    SiAuth0,
    SiStripe,
    SiOpenai,
    SiTensorflow,
    SiPytorch,
    SiNumpy,
    SiPandas,
    SiJupyter,
} from 'react-icons/si';

import {
    FaDatabase,
    FaServer,
    FaCloud,
    FaCode,
    FaCog,
    FaTerminal,
    FaMobile,
    FaDesktop,
    FaLock,
    FaChartBar,
    FaBrain,
} from 'react-icons/fa';

// Technology mapping with icons and brand colors
const TECH_ICON_MAP = {
    // Frontend Frameworks
    'react': { icon: SiReact, color: '#61DAFB', label: 'React' },
    'react.js': { icon: SiReact, color: '#61DAFB', label: 'React' },
    'reactjs': { icon: SiReact, color: '#61DAFB', label: 'React' },
    'angular': { icon: SiAngular, color: '#DD0031', label: 'Angular' },
    'vue': { icon: SiVuedotjs, color: '#4FC08D', label: 'Vue.js' },
    'vue.js': { icon: SiVuedotjs, color: '#4FC08D', label: 'Vue.js' },
    'vuejs': { icon: SiVuedotjs, color: '#4FC08D', label: 'Vue.js' },
    'svelte': { icon: SiSvelte, color: '#FF3E00', label: 'Svelte' },
    'next': { icon: SiNextdotjs, color: '#FFFFFF', label: 'Next.js' },
    'next.js': { icon: SiNextdotjs, color: '#FFFFFF', label: 'Next.js' },
    'nextjs': { icon: SiNextdotjs, color: '#FFFFFF', label: 'Next.js' },

    // Languages
    'javascript': { icon: SiJavascript, color: '#F7DF1E', label: 'JavaScript' },
    'js': { icon: SiJavascript, color: '#F7DF1E', label: 'JavaScript' },
    'typescript': { icon: SiTypescript, color: '#3178C6', label: 'TypeScript' },
    'ts': { icon: SiTypescript, color: '#3178C6', label: 'TypeScript' },
    'python': { icon: SiPython, color: '#3776AB', label: 'Python' },
    'c#': { icon: SiDotnet, color: '#512BD4', label: 'C#' },
    'csharp': { icon: SiDotnet, color: '#512BD4', label: 'C#' },
    'c++': { icon: SiCplusplus, color: '#00599C', label: 'C++' },
    'cpp': { icon: SiCplusplus, color: '#00599C', label: 'C++' },
    'rust': { icon: SiRust, color: '#FFFFFF', label: 'Rust' },
    'go': { icon: SiGo, color: '#00ADD8', label: 'Go' },
    'golang': { icon: SiGo, color: '#00ADD8', label: 'Go' },
    'php': { icon: SiPhp, color: '#777BB4', label: 'PHP' },
    'swift': { icon: SiSwift, color: '#F05138', label: 'Swift' },
    'kotlin': { icon: SiKotlin, color: '#7F52FF', label: 'Kotlin' },

    // Backend Frameworks
    '.net': { icon: SiDotnet, color: '#512BD4', label: '.NET' },
    'dotnet': { icon: SiDotnet, color: '#512BD4', label: '.NET' },
    'asp.net': { icon: SiDotnet, color: '#512BD4', label: 'ASP.NET' },
    'node': { icon: SiNodedotjs, color: '#339933', label: 'Node.js' },
    'node.js': { icon: SiNodedotjs, color: '#339933', label: 'Node.js' },
    'nodejs': { icon: SiNodedotjs, color: '#339933', label: 'Node.js' },
    'express': { icon: SiExpress, color: '#FFFFFF', label: 'Express' },
    'express.js': { icon: SiExpress, color: '#FFFFFF', label: 'Express' },
    'django': { icon: SiDjango, color: '#092E20', label: 'Django' },
    'fastapi': { icon: SiFastapi, color: '#009688', label: 'FastAPI' },
    'flask': { icon: SiFlask, color: '#FFFFFF', label: 'Flask' },
    'spring': { icon: SiSpring, color: '#6DB33F', label: 'Spring' },
    'spring boot': { icon: SiSpring, color: '#6DB33F', label: 'Spring Boot' },
    'laravel': { icon: SiLaravel, color: '#FF2D20', label: 'Laravel' },

    // Databases
    'mongodb': { icon: SiMongodb, color: '#47A248', label: 'MongoDB' },
    'mongo': { icon: SiMongodb, color: '#47A248', label: 'MongoDB' },
    'postgresql': { icon: SiPostgresql, color: '#4169E1', label: 'PostgreSQL' },
    'postgres': { icon: SiPostgresql, color: '#4169E1', label: 'PostgreSQL' },
    'mysql': { icon: SiMysql, color: '#4479A1', label: 'MySQL' },
    'redis': { icon: SiRedis, color: '#DC382D', label: 'Redis' },
    'elasticsearch': { icon: SiElasticsearch, color: '#005571', label: 'Elasticsearch' },
    'prisma': { icon: SiPrisma, color: '#2D3748', label: 'Prisma' },
    'sql': { icon: FaDatabase, color: '#336791', label: 'SQL' },
    'sql server': { icon: FaDatabase, color: '#CC2927', label: 'SQL Server' },

    // Cloud & DevOps
    'aws': { icon: SiAmazonwebservices, color: '#FF9900', label: 'AWS' },
    'amazon web services': { icon: SiAmazonwebservices, color: '#FF9900', label: 'AWS' },
    'azure': { icon: FaCloud, color: '#0078D4', label: 'Azure' },
    'microsoft azure': { icon: FaCloud, color: '#0078D4', label: 'Azure' },
    'gcp': { icon: SiGooglecloud, color: '#4285F4', label: 'GCP' },
    'google cloud': { icon: SiGooglecloud, color: '#4285F4', label: 'GCP' },
    'docker': { icon: SiDocker, color: '#2496ED', label: 'Docker' },
    'kubernetes': { icon: SiKubernetes, color: '#326CE5', label: 'Kubernetes' },
    'k8s': { icon: SiKubernetes, color: '#326CE5', label: 'Kubernetes' },
    'terraform': { icon: SiTerraform, color: '#7B42BC', label: 'Terraform' },
    'ansible': { icon: SiAnsible, color: '#EE0000', label: 'Ansible' },
    'jenkins': { icon: SiJenkins, color: '#D24939', label: 'Jenkins' },
    'nginx': { icon: SiNginx, color: '#009639', label: 'Nginx' },
    'linux': { icon: SiLinux, color: '#FCC624', label: 'Linux' },
    'vercel': { icon: SiVercel, color: '#FFFFFF', label: 'Vercel' },
    'netlify': { icon: SiNetlify, color: '#00C7B7', label: 'Netlify' },

    // APIs & Data
    'graphql': { icon: SiGraphql, color: '#E10098', label: 'GraphQL' },
    'apollo': { icon: SiApollographql, color: '#311C87', label: 'Apollo' },
    'rest': { icon: SiSwagger, color: '#85EA2D', label: 'REST API' },
    'rest api': { icon: SiSwagger, color: '#85EA2D', label: 'REST API' },
    'api': { icon: FaServer, color: '#0D9488', label: 'API' },

    // State Management
    'redux': { icon: SiRedux, color: '#764ABC', label: 'Redux' },
    'mobx': { icon: SiMobx, color: '#FF9955', label: 'MobX' },

    // Styling
    'tailwind': { icon: SiTailwindcss, color: '#06B6D4', label: 'Tailwind CSS' },
    'tailwindcss': { icon: SiTailwindcss, color: '#06B6D4', label: 'Tailwind CSS' },
    'material ui': { icon: SiMui, color: '#007FFF', label: 'Material UI' },
    'mui': { icon: SiMui, color: '#007FFF', label: 'MUI' },
    'material-ui': { icon: SiMui, color: '#007FFF', label: 'Material UI' },
    'sass': { icon: SiSass, color: '#CC6699', label: 'Sass' },
    'scss': { icon: SiSass, color: '#CC6699', label: 'SCSS' },
    'css': { icon: SiCss3, color: '#1572B6', label: 'CSS' },
    'css3': { icon: SiCss3, color: '#1572B6', label: 'CSS3' },
    'html': { icon: SiHtml5, color: '#E34F26', label: 'HTML' },
    'html5': { icon: SiHtml5, color: '#E34F26', label: 'HTML5' },

    // Testing
    'jest': { icon: SiJest, color: '#C21325', label: 'Jest' },
    'cypress': { icon: SiCypress, color: '#17202C', label: 'Cypress' },
    'playwright': { icon: FaCode, color: '#2EAD33', label: 'Playwright' },
    'selenium': { icon: SiSelenium, color: '#43B02A', label: 'Selenium' },
    'storybook': { icon: SiStorybook, color: '#FF4785', label: 'Storybook' },

    // Build Tools
    'webpack': { icon: SiWebpack, color: '#8DD6F9', label: 'Webpack' },
    'vite': { icon: SiVite, color: '#646CFF', label: 'Vite' },

    // Version Control
    'git': { icon: SiGit, color: '#F05032', label: 'Git' },
    'github': { icon: SiGithub, color: '#FFFFFF', label: 'GitHub' },
    'gitlab': { icon: SiGitlab, color: '#FC6D26', label: 'GitLab' },

    // Mobile
    'android': { icon: SiAndroid, color: '#3DDC84', label: 'Android' },
    'ios': { icon: SiIos, color: '#FFFFFF', label: 'iOS' },
    'flutter': { icon: SiFlutter, color: '#02569B', label: 'Flutter' },
    'react native': { icon: SiReact, color: '#61DAFB', label: 'React Native' },

    // Firebase & Auth
    'firebase': { icon: SiFirebase, color: '#FFCA28', label: 'Firebase' },
    'auth0': { icon: SiAuth0, color: '#EB5424', label: 'Auth0' },

    // Monitoring
    'prometheus': { icon: SiPrometheus, color: '#E6522C', label: 'Prometheus' },
    'grafana': { icon: SiGrafana, color: '#F46800', label: 'Grafana' },
    'datadog': { icon: SiDatadog, color: '#632CA6', label: 'Datadog' },
    'sentry': { icon: SiSentry, color: '#362D59', label: 'Sentry' },

    // Message Queues
    'rabbitmq': { icon: SiRabbitmq, color: '#FF6600', label: 'RabbitMQ' },
    'kafka': { icon: SiApachekafka, color: '#231F20', label: 'Kafka' },

    // AI/ML
    'openai': { icon: SiOpenai, color: '#412991', label: 'OpenAI' },
    'tensorflow': { icon: SiTensorflow, color: '#FF6F00', label: 'TensorFlow' },
    'pytorch': { icon: SiPytorch, color: '#EE4C2C', label: 'PyTorch' },
    'numpy': { icon: SiNumpy, color: '#013243', label: 'NumPy' },
    'pandas': { icon: SiPandas, color: '#150458', label: 'Pandas' },
    'jupyter': { icon: SiJupyter, color: '#F37626', label: 'Jupyter' },
    'machine learning': { icon: FaBrain, color: '#0D9488', label: 'Machine Learning' },
    'ml': { icon: FaBrain, color: '#0D9488', label: 'ML' },
    'ai': { icon: FaBrain, color: '#0D9488', label: 'AI' },

    // Tools
    'figma': { icon: SiFigma, color: '#F24E1E', label: 'Figma' },
    'jira': { icon: SiJira, color: '#0052CC', label: 'Jira' },
    'confluence': { icon: SiConfluence, color: '#172B4D', label: 'Confluence' },
    'slack': { icon: SiSlack, color: '#4A154B', label: 'Slack' },
    'vscode': { icon: FaCode, color: '#007ACC', label: 'VS Code' },
    'intellij': { icon: SiIntellijidea, color: '#000000', label: 'IntelliJ' },
    'stripe': { icon: SiStripe, color: '#635BFF', label: 'Stripe' },

    // Generic fallbacks
    'backend': { icon: FaServer, color: '#0D9488', label: 'Backend' },
    'frontend': { icon: FaDesktop, color: '#0D9488', label: 'Frontend' },
    'cloud': { icon: FaCloud, color: '#0D9488', label: 'Cloud' },
    'security': { icon: FaLock, color: '#0D9488', label: 'Security' },
    'analytics': { icon: FaChartBar, color: '#0D9488', label: 'Analytics' },
    'mobile': { icon: FaMobile, color: '#0D9488', label: 'Mobile' },
    'devops': { icon: FaCog, color: '#0D9488', label: 'DevOps' },
    'cli': { icon: FaTerminal, color: '#0D9488', label: 'CLI' },
};

// Default icon for unknown technologies
const DEFAULT_ICON = { icon: FaCode, color: '#0D9488', label: 'Technology' };

/**
 * Get icon and color for a technology string
 * @param {string} tech - Technology name
 * @returns {{ icon: Component, color: string, label: string }}
 */
export const getTechIcon = (tech) => {
    if (!tech) return DEFAULT_ICON;

    // Normalize the tech string
    const normalizedTech = tech.toLowerCase().trim();

    // Direct match
    if (TECH_ICON_MAP[normalizedTech]) {
        return TECH_ICON_MAP[normalizedTech];
    }

    // Partial match - find first key that includes the tech or tech includes the key
    const partialMatch = Object.entries(TECH_ICON_MAP).find(([key]) => {
        return normalizedTech.includes(key) || key.includes(normalizedTech);
    });

    if (partialMatch) {
        return partialMatch[1];
    }

    // Return default with the original label
    return { ...DEFAULT_ICON, label: tech };
};

/**
 * Check if a technology has a known icon
 * @param {string} tech - Technology name
 * @returns {boolean}
 */
export const hasTechIcon = (tech) => {
    if (!tech) return false;
    const normalizedTech = tech.toLowerCase().trim();
    return Object.keys(TECH_ICON_MAP).some(key =>
        normalizedTech.includes(key) || key.includes(normalizedTech)
    );
};

/**
 * Get all available technology icons
 * @returns {string[]}
 */
export const getAvailableTechs = () => {
    return Object.keys(TECH_ICON_MAP);
};

export default getTechIcon;
