// src/reducers/animationSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AnimationService from '../services/AnimationService';
import { getAvailableAnimationIds } from '../themes/animations';

// Get available animations from registry
const animations = getAvailableAnimationIds();

// Get initial value from service
const initialAnimation = AnimationService.getAnimation();

const initialState = {
    animationMode: animations.includes(initialAnimation) ? initialAnimation : 'magical',
    animationSpeed: AnimationService.getAnimationSpeed() || 1,
    reducedMotion: AnimationService.getReducedMotion() || false,
};

export const animationSlice = createSlice({
    name: 'animation',
    initialState,
    reducers: {
        setAnimationMode: (state, action) => {
            if (animations.includes(action.payload) || action.payload === 'none') {
                state.animationMode = action.payload;
                AnimationService.setAnimation(action.payload);
            }
        },

        toggleAnimation: (state) => {
            const currentIndex = animations.indexOf(state.animationMode);
            const nextIndex = (currentIndex + 1) % animations.length;
            state.animationMode = animations[nextIndex];
            AnimationService.setAnimation(state.animationMode);
        },

        setAnimationSpeed: (state, action) => {
            const speed = Math.max(0.1, Math.min(3, action.payload));
            state.animationSpeed = speed;
            AnimationService.setAnimationSpeed(speed);
        },

        toggleReducedMotion: (state) => {
            state.reducedMotion = !state.reducedMotion;
            AnimationService.setReducedMotion(state.reducedMotion);
        },

        disableAnimations: (state) => {
            state.animationMode = 'none';
            AnimationService.setAnimation('none');
        },

        enableAnimations: (state) => {
            state.animationMode = 'magical';
            AnimationService.setAnimation('magical');
        },
    },
});

export const {
    setAnimationMode,
    toggleAnimation,
    setAnimationSpeed,
    toggleReducedMotion,
    disableAnimations,
    enableAnimations,
} = animationSlice.actions;

// Selectors
export const selectAnimationMode = (state) => state.animation.animationMode;
export const selectAnimationSpeed = (state) => state.animation.animationSpeed;
export const selectReducedMotion = (state) => state.animation.reducedMotion;
export const selectIsAnimated = (state) => state.animation.animationMode !== 'none';
export const selectAvailableAnimations = () => animations;

export default animationSlice.reducer;