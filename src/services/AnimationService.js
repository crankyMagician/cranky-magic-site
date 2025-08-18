// src/services/AnimationService.js
import { getAvailableAnimationIds, validateAnimationId } from '../themes/animations';

class AnimationService {
    static animationKey = 'appAnimation';
    static animationSpeedKey = 'animationSpeed';
    static reducedMotionKey = 'reducedMotion';

    // Available animations from registry
    static get availableAnimations() {
        return getAvailableAnimationIds();
    }

    // Animation mode management
    static setAnimation(animationId) {
        console.log(`AnimationService.setAnimation called with: ${animationId}`);
        if (animationId === 'none' || validateAnimationId(animationId)) {
            localStorage.setItem(this.animationKey, animationId);
            console.log(`Animation set to: ${animationId}`);
            // Apply animation classes to document root
            this.applyAnimationMode(animationId);
        } else {
            console.warn(`Invalid animation: ${animationId}. Using default.`);
            localStorage.setItem(this.animationKey, 'magical');
            this.applyAnimationMode('magical');
        }
    }

    static getAnimation() {
        const saved = localStorage.getItem(this.animationKey);
        console.log(`AnimationService.getAnimation - saved: ${saved}`);
        if (saved === 'none' || (saved && validateAnimationId(saved))) {
            return saved;
        }
        return 'magical'; // Default animation
    }

    // Animation speed management
    static setAnimationSpeed(speed) {
        const validSpeed = Math.max(0.1, Math.min(3, speed));
        localStorage.setItem(this.animationSpeedKey, validSpeed.toString());
        this.applyAnimationSpeed(validSpeed);
    }

    static getAnimationSpeed() {
        const saved = localStorage.getItem(this.animationSpeedKey);
        return saved ? parseFloat(saved) : 1;
    }

    // Reduced motion management
    static setReducedMotion(enabled) {
        localStorage.setItem(this.reducedMotionKey, enabled.toString());
        this.applyReducedMotion(enabled);
    }

    static getReducedMotion() {
        const saved = localStorage.getItem(this.reducedMotionKey);
        const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return saved ? saved === 'true' : systemPreference;
    }

    // Apply animation mode to document
    static applyAnimationMode(animationId) {
        const root = document.documentElement;

        // Remove all animation classes
        this.availableAnimations.forEach(id => {
            root.classList.remove(`animation-${id}`);
        });
        root.classList.remove('animation-none');

        // Add new animation class
        if (animationId === 'none') {
            root.classList.add('animation-none');
            root.style.setProperty('--animation-multiplier', '0');
        } else {
            root.classList.add(`animation-${animationId}`);
            root.style.setProperty('--animation-multiplier', '1');
        }
    }

    // Apply animation speed to document
    static applyAnimationSpeed(speed) {
        const root = document.documentElement;
        root.style.setProperty('--animation-speed', speed);
        root.style.setProperty('--animation-duration-multiplier', 1 / speed);
    }

    // Apply reduced motion preference
    static applyReducedMotion(enabled) {
        const root = document.documentElement;
        if (enabled) {
            root.classList.add('reduced-motion');
            root.style.setProperty('--reduced-motion', '1');
        } else {
            root.classList.remove('reduced-motion');
            root.style.setProperty('--reduced-motion', '0');
        }
    }

    // Initialize animation settings
    static init() {
        const animationMode = this.getAnimation();
        const animationSpeed = this.getAnimationSpeed();
        const reducedMotion = this.getReducedMotion();

        this.applyAnimationMode(animationMode);
        this.applyAnimationSpeed(animationSpeed);
        this.applyReducedMotion(reducedMotion);
    }

    // Check if animations are enabled
    static isAnimated() {
        return this.getAnimation() !== 'none' && !this.getReducedMotion();
    }

    // Get animation CSS variables
    static getAnimationVariables() {
        return {
            '--animation-speed': this.getAnimationSpeed(),
            '--animation-duration-multiplier': 1 / this.getAnimationSpeed(),
            '--animation-multiplier': this.getAnimation() === 'none' ? 0 : 1,
            '--reduced-motion': this.getReducedMotion() ? 1 : 0,
        };
    }
}

export default AnimationService;