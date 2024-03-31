import React, { useState } from 'react';
import AgencyNames from './AgencyNames';
import { Accordion, AccordionSummary, AccordionDetails, Box, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

import useCustomTranslation from "../hooks/useCustomTranslation";

const AgencyNameSearchBoxComponent = ({ onSelectionChange }) => {
    const [selectedAgencies, setSelectedAgencies] = useState({});
    const [error, setError] = useState('');
    const theme = useTheme();

    const { translate } = useCustomTranslation();

    const handleSelectionChange = (newSelection) => {
        setSelectedAgencies(newSelection);
        onSelectionChange(newSelection);
    };

    return (
        <Box sx={{
            width: '85%',
            margin: 'auto',
            overflow: 'hidden',
        }}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    {translate('Choose Agencies')}
                </AccordionSummary>
                <AccordionDetails sx={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: theme.spacing(2),
                }}>
                    <AgencyNames onSelectionChange={handleSelectionChange} />
                    {error && <Alert severity="error" sx={{marginTop: theme.spacing(2)}}>{translate("Error occurred:")} {translate(error)}</Alert>}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default AgencyNameSearchBoxComponent;
