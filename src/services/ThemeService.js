// src/services/ThemeService.js
class ThemeService {
    static themeKey = 'appTheme';

    static setTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
    }

    static getTheme() {
        return localStorage.getItem(this.themeKey);
    }
}

export default ThemeService;