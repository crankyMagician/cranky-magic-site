// src/themes/animations/dynamicAnimations.js
import { keyframes } from '@mui/material/styles';

// Dynamic bounce in
const dynamicBounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(100px);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1) translateY(-20px);
  }
  75% {
    transform: scale(0.9) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// Dynamic shake
const dynamicShake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
`;

// Dynamic rotate in
const dynamicRotateIn = keyframes`
  0% {
    opacity: 0;
    transform: rotate(-200deg) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
`;

// Dynamic flip
const dynamicFlip = keyframes`
  0% {
    transform: perspective(400px) rotateY(0);
  }
  40% {
    transform: perspective(400px) rotateY(170deg);
  }
  50% {
    transform: perspective(400px) rotateY(190deg) scale(1.2);
  }
  80% {
    transform: perspective(400px) rotateY(360deg) scale(0.95);
  }
  100% {
    transform: perspective(400px) rotateY(360deg) scale(1);
  }
`;

// Dynamic zoom
const dynamicZoom = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) rotate(360deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
`;

// Dynamic pulse
const dynamicPulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 20px rgba(0, 123, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

const dynamicAnimations = {
    bounceIn: dynamicBounceIn,
    shake: dynamicShake,
    rotateIn: dynamicRotateIn,
    flip: dynamicFlip,
    zoom: dynamicZoom,
    pulse: dynamicPulse,
    entrance: dynamicBounceIn,
    exit: dynamicZoom,
    hover: dynamicPulse,
};

export default dynamicAnimations;