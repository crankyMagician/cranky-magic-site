/**
 * Real Portfolio Experience Data
 * Work history, education, and achievements
 * Last updated: January 2026
 */

import React from 'react';
import { Work, School, Code } from '@mui/icons-material';

export const experienceData = [
  {
    id: 'freelance-dev',
    date: '2022 - Present',
    title: 'Full Stack Developer & Solutions Architect',
    company: 'Freelance / Blazar Software',
    location: 'Inglewood, CA (Remote)',
    type: 'work',
    icon: <Work />,
    description: 'Delivering scalable cloud solutions and full-stack applications for clients across various industries',
    achievements: [
      'Architected and deployed 10+ production applications using React, .NET, and cloud platforms',
      'Developed cross-platform mobile solutions with React Native serving thousands of users',
      'Implemented automated data pipelines with Python reducing manual processing by 80%',
      'Built reusable templates and frameworks accelerating development timelines by 40%'
    ],
    technologies: ['React', 'React Native', 'C#', '.NET', 'Python', 'Azure', 'Docker', 'PostgreSQL']
  },
  {
    id: 'wilmington-edu',
    date: '2018 - 2022',
    title: 'Bachelor of Science, Computer Science',
    company: 'Wilmington University',
    location: 'Delaware',
    type: 'education',
    icon: <School />,
    description: 'Focused on software engineering, cloud architecture, and full-stack development',
    achievements: [
      'Completed coursework in data structures, algorithms, and distributed systems',
      'Built multiple full-stack projects demonstrating modern development practices',
      'Participated in coding competitions and collaborative projects'
    ]
  },
  {
    id: 'open-source',
    date: '2020 - Present',
    title: 'Open Source Contributor',
    company: 'GitHub Community',
    type: 'projects',
    icon: <Code />,
    description: 'Active contributor to open-source projects and maintainer of public repositories',
    achievements: [
      'Maintained 20+ public repositories covering React, Python, C#, and mobile development',
      'Created reusable templates and frameworks used by other developers',
      'Contributed to community knowledge through code examples and documentation'
    ],
    technologies: ['Various - React', 'Python', 'C#', 'JavaScript', 'React Native']
  }
];

/**
 * Filter experience by type
 * @param {Array} experiences - Array of experience objects
 * @param {string} type - Type filter ('all', 'work', 'education', 'projects')
 * @returns {Array} Filtered experiences
 */
export const filterExperienceByType = (experiences, type) => {
  if (type === 'all') return experiences;
  return experiences.filter(exp => exp.type === type);
};

/**
 * Get work experience only
 * @param {Array} experiences - Array of experience objects
 * @returns {Array} Work experiences
 */
export const getWorkExperience = (experiences) => {
  return experiences.filter(exp => exp.type === 'work');
};

/**
 * Get education only
 * @param {Array} experiences - Array of experience objects
 * @returns {Array} Education experiences
 */
export const getEducation = (experiences) => {
  return experiences.filter(exp => exp.type === 'education');
};
