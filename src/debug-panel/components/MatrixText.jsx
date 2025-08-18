// debug-panel/components/MatrixText.jsx
import React from 'react';

const getRandomChar = () => {
    const chars = '01_$[]{}|<>/\\=#*~^`';
    return chars.charAt(Math.floor(Math.random() * chars.length));
};

const MatrixText = ({ children, glitchChance = 0.1, theme, ...props }) => {
    // Decide whether to "glitch" the text
    const shouldGlitch = Math.random() < glitchChance;
    if (!shouldGlitch || !children) return <span {...props}>{children}</span>;

    const text = children.toString();
    const randomIndex = Math.floor(Math.random() * text.length);
    return (
        <span {...props}>
            {text.substring(0, randomIndex)}
            <span style={{
                color: theme?.palette?.primary.main || 'green',
                textShadow: `0 0 5px ${theme?.palette?.primary.main || 'green'}`
            }}>
                {getRandomChar()}
            </span>
            {text.substring(randomIndex + 1)}
        </span>
    );
};

export default MatrixText;