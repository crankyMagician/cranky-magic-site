// src/themes/animations/playfulAnimations.js
import { keyframes } from '@mui/material/styles';

// Playful wiggle
const playfulWiggle = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
`;

// Playful bounce
const playfulBounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

// Playful rubber band
const playfulRubberBand = keyframes`
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  100% {
    transform: scale(1);
  }
`;

// Playful jello
const playfulJello = keyframes`
  0%, 100% {
    transform: skewX(0deg) skewY(0deg);
  }
  30% {
    transform: skewX(-12deg) skewY(-12deg);
  }
  40% {
    transform: skewX(6deg) skewY(6deg);
  }
  50% {
    transform: skewX(-3deg) skewY(-3deg);
  }
  65% {
    transform: skewX(1deg) skewY(1deg);
  }
  75% {
    transform: skewX(-0.5deg) skewY(-0.5deg);
  }
`;

// Playful tada
const playfulTada = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  10%, 20% {
    transform: scale(0.9) rotate(-3deg);
  }
  30%, 50%, 70%, 90% {
    transform: scale(1.1) rotate(3deg);
  }
  40%, 60%, 80% {
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

// Playful swing
const playfulSwing = keyframes`
  20% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const playfulAnimations = {
    wiggle: playfulWiggle,
    bounce: playfulBounce,
    rubberBand: playfulRubberBand,
    jello: playfulJello,
    tada: playfulTada,
    swing: playfulSwing,
    entrance: playfulTada,
    exit: playfulBounce,
    hover: playfulWiggle,
};

export default playfulAnimations;