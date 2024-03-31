import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPreference } from '../reducers/preferenceSlice'; // Make sure the path matches your file structure
import PreferenceService from '../services/PreferenceService';

const useStoredPreferences = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Get the preferences from storage
        const storedPreferences = PreferenceService.getPreference();
        if (storedPreferences) {
            // Dispatch setPreference with the stored value
            dispatch(setPreference(storedPreferences));
        }
    }, [dispatch]);
};

export default useStoredPreferences;
