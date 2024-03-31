
# React Redux Language Switch 🌐

This project demonstrates how to integrate a language switch feature in a React application using Redux for state management and `localStorage` for persisting user preferences across sessions.

## Overview 📖

We implemented a simple but flexible system for changing and storing the user's preferred language, consisting of the following key components:

- **LanguageService**: A service to interact with `localStorage`, allowing the application to save and retrieve the user's language preference.
- **languageSlice**: A Redux slice for managing the language state within the application, integrated with `LanguageService` to persist changes.
- **useCustomTranslation Hook**: A custom React hook utilizing `react-i18next` for managing translations based on the current language state.

## How It Works 🛠️

1. **LanguageService**: Handles reading from and writing to `localStorage`, ensuring that the user's language preference is maintained across sessions.

```javascript
class LanguageService {
    static languageKey = 'appLanguage';

    static setLanguage(language) {
        localStorage.setItem(this.languageKey, language);
    }

    static getLanguage() {
        return localStorage.getItem(this.languageKey) || 'en'; // Default to 'en'
    }
}
```

2. **languageSlice**: A slice of Redux state dedicated to managing the language. It is initialized with the user's preferred language from `localStorage` and updates both the state and `localStorage` when the language is changed.

```javascript
import { createSlice } from '@reduxjs/toolkit';
import LanguageService from '../services/LanguageService';

const initialState = {
    language: LanguageService.getLanguage(),
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage(state, action) {
            state.language = action.payload;
            LanguageService.setLanguage(action.payload);
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
```

3. **useCustomTranslation Hook**: A hook that makes it easy to translate text in components based on the current language state.

## Example: Translating Text 🌍

To translate a piece of text based on the current language state, you can use the `useCustomTranslation` hook as follows:

```jsx
import React from 'react';
import useCustomTranslation from './hooks/useCustomTranslation';

const Greeting = () => {
    const { translate } = useCustomTranslation();

    return <h1>{translate('Hello, World!')}</h1>;
};
```

Ensure your translations are set up correctly in `react-i18next` and match the keys used in your components.

## Conclusion 🔚

This setup provides a robust foundation for managing language preferences in a React application, leveraging Redux for state management and integrating seamlessly with translation libraries like `react-i18next`.
