import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosServices from '../utilities/axios';
import AuthTokenService from '../services/AuthTokenService';
import GrantCategories from './GrantCategories';
import { logDebug, logError } from '../utilities/Logger';
import { ErrorToast} from "./ErrorToast";
import { SuccessToast } from './SuccessToast';
import useCustomTranslation from "../hooks/useCustomTranslation"; // Assuming this is your custom hook for translation

const ChooseGrantCategoriesComponent = ({ activeOnly }) => {
    const [error, setError] = useState('');
    const [selectedCategories, setSelectedCategories] = useState({});
    const navigate = useNavigate();
    const { translate } = useCustomTranslation(); // Use your custom hook here

    const { user: username } = AuthTokenService.getAuthInfo();

    // This function is updated to handle the new structure of selectedCategories
    const handleSelectionChange = (newSelection) => {
        // Filter out unselected categories and keep only the selected ones along with their names
        const selectedWithNames = Object.entries(newSelection).reduce((acc, [categoryId, { selected, name }]) => {
            if (selected) {
                // Keep category if it's selected
                acc[categoryId] = { name };
            }
            return acc;
        }, {});

        setSelectedCategories(selectedWithNames);
    };
    const handleSubmit = async () => {
        const categoriesToSubmit = Object.entries(selectedCategories).map(([categoryId, { name }]) => ({
            categoryId: parseInt(categoryId, 10),
            categoryName: name
        }));

        const endpoint = `/api/UserAccountService/select-categories?username=${encodeURIComponent(username)}`;

        try {
            const response = await axiosServices.post(endpoint, categoriesToSubmit);
            if (response.status === 200) {
                SuccessToast(translate('CategoriesSubmittedSuccess'));
            } else {
                throw new Error(translate('SubmissionNotSuccessful'));
            }
        } catch (error) {
            logError(`Error submitting categories: ${error}`, 'red');
            setError(translate('ErrorSubmittingCategories'));
            ErrorToast(translate('ErrorAlert', { errorMessage: error.message }));
        }
    };

    return (
        <div>
            <GrantCategories activeOnly={activeOnly} onSelectionChange={handleSelectionChange} />
            <button className="btn btn-primary" onClick={handleSubmit}>{translate('SubmitCategoriesButton')}</button>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
        </div>
    );
};

export default ChooseGrantCategoriesComponent;
