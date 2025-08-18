// src/themes/animations/elegantAnimations.js
import { keyframes } from '@mui/material/styles';

// Elegant fade with blur
const elegantFadeIn = keyframes`
  0% {
    opacity: 0;
    filter: blur(4px);
    transform: translateY(20px) scale(0.98);
  }
  50% {
    opacity: 0.7;
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
`;

const elegantFadeOut = keyframes`
  0% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    filter: blur(4px);
    transform: translateY(-20px) scale(0.98);
  }
`;

// Elegant slide
const elegantSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  60% {
    opacity: 1;
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
`;

// Elegant reveal
const elegantReveal = keyframes`
  0% {
    opacity: 0;
    transform: perspective(1000px) rotateY(-10deg) translateZ(-50px);
  }
  100% {
    opacity: 1;
    transform: perspective(1000px) rotateY(0) translateZ(0);
  }
`;

// Elegant hover
const elegantHover = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

// Elegant shimmer
const elegantShimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const elegantAnimations = {
    fadeIn: elegantFadeIn,
    fadeOut: elegantFadeOut,
    slide: elegantSlide,
    reveal: elegantReveal,
    hover: elegantHover,
    shimmer: elegantShimmer,
    entrance: elegantFadeIn,
    exit: elegantFadeOut,
};

export default elegantAnimations;