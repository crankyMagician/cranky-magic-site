import React, { useState, useEffect, useCallback } from 'react';
import axiosServices from '../utilities/axios';
import { Grid, Checkbox, Container, CssBaseline, Paper, Typography } from '@mui/material/';
import { SuccessToast } from "./SuccessToast";
import { ErrorToast } from "./ErrorToast";
import { logInfo, logDebug } from '../utilities/Logger';
import useCustomTranslation from "../hooks/useCustomTranslation";
function GrantCategories({ activeOnly, onSelectionChange }) {
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState({});
    const { translate } = useCustomTranslation();
    const fetchGrantCategories = useCallback(async () => {
        const endpoint = activeOnly ? '/api/GrantSearchService/active-grant-categories' : '/api/GrantSearchService/grant-categories';
        logDebug(`Fetching ${activeOnly ? 'active ' : ''}grant categories started`, 'green');

        try {
            const response = await axiosServices.get(`${endpoint}`);
            setCategories(response.data);
            const initialCheckState = response.data.reduce((acc, category) => ({
                ...acc,
                [category.categoryId]: { selected: false, name: category.categoryName }
            }), {});
            setChecked(initialCheckState);
            SuccessToast(`${activeOnly ? 'Active ' : ''}Grant categories fetched successfully!`);
            logInfo(`${activeOnly ? 'Active ' : ''}Grant categories fetched successfully`, 'blue');
        } catch (error) {
            ErrorToast('Failed to fetch grant categories');
        }
    }, [activeOnly]);

    useEffect(() => {
        fetchGrantCategories();
    }, [fetchGrantCategories]);

    const handleToggle = (categoryId) => () => {
        const category = categories.find(category => category.categoryId === categoryId);
        const newState = {
            ...checked,
            [categoryId]: { selected: !checked[categoryId].selected, name: category.categoryName }
        };
        setChecked(newState);
        onSelectionChange(newState);
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <CssBaseline />
            <Typography variant="h6" sx={{ margin: 2 }}>
                {translate('CategorySelection')}
            </Typography>
            <Grid container spacing={2}>
                {categories.map((category) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={category.categoryId}>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Checkbox
                                edge="start"
                                checked={checked[category.categoryId]?.selected || false}
                                tabIndex={-1}
                                disableRipple
                                onClick={handleToggle(category.categoryId)}
                                inputProps={{
                                    'aria-label': translate('CategoryCheckboxLabel', { categoryName: category.categoryName })
                                }}
                            />
                            <Typography>{category.categoryName}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default GrantCategories;
