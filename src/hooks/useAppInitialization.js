// useAppInitialization.js
import useAuthentication from './useAuthentication';
import useStoredTheme from './useStoredTheme';
import useStoredPreferences from './useStoredPreferences';
import useSyncLanguage from './useSyncLanguage';

function useAppInitialization() {
    useAuthentication();
    useStoredTheme();
    useStoredPreferences();
    useSyncLanguage();
}

export default useAppInitialization;
