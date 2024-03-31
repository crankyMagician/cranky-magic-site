import React, { useState, useEffect, useCallback } from 'react';
import axiosServices from '../utilities/axios';
import { Grid, Checkbox, Container, CssBaseline, Paper, Typography } from '@mui/material/';
import { SuccessToast } from "./SuccessToast";
import { ErrorToast } from "./ErrorToast";
import { logInfo, logDebug, logError } from '../utilities/Logger';
import useCustomTranslation from "../hooks/useCustomTranslation";
function AgencyNames({ onSelectionChange }) {
    const [agencies, setAgencies] = useState([]);
    const [checked, setChecked] = useState({});
    const { translate } = useCustomTranslation();
    const fetchAgencyNames = useCallback(async () => {
        const endpoint = '/api/GrantSearchService/active-agency-names';
        logDebug('Fetching active agency names started', 'green');

        try {
            const response = await axiosServices.get(endpoint);
            setAgencies(response.data);
            const initialCheckState = response.data.reduce((acc, agencyName, index) => ({
                ...acc,
                [index]: { selected: false, name: agencyName }
            }), {});
            setChecked(initialCheckState);
            SuccessToast('Active agency names fetched successfully!');
            logInfo('Active agency names fetched successfully', 'blue');
        } catch (error) {
            ErrorToast('Failed to fetch agency names');
            logError('Failed to fetch agency names', 'red');
        }
    }, []);

    useEffect(() => {
        fetchAgencyNames();
    }, [fetchAgencyNames]);

    const handleToggle = (index) => () => {
        const newState = {
            ...checked,
            [index]: { selected: !checked[index].selected, name: agencies[index] }
        };
        setChecked(newState);
        onSelectionChange(newState);
    };

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Typography variant="h6" sx={{ margin: 2 }}>
                {translate('AgencySelection')}
            </Typography>
            <Grid container spacing={2}>
                {agencies.map((agencyName, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Checkbox
                                edge="start"
                                checked={checked[index]?.selected || false}
                                tabIndex={-1}
                                disableRipple
                                onClick={handleToggle(index)}
                                inputProps={{
                                    'aria-label': translate('AgencyCheckboxLabel', { agencyName })
                                }}
                            />
                            <Typography>{agencyName}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default AgencyNames;
