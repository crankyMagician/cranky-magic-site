import React, { useState } from 'react';
import GrantCategories from './GrantCategories';
import { Accordion, AccordionSummary, AccordionDetails, Box, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import useCustomTranslation from "../hooks/useCustomTranslation"; // Import your custom translation hook

const GrantCategorySearchBoxComponent = ({ onSelectionChange }) => {
    const [selectedCategories, setSelectedCategories] = useState({});
    const [error, setError] = useState('');
    const theme = useTheme();
    const { translate } = useCustomTranslation(); // Use your custom translation hook

    const handleSelectionChange = (newSelection) => {
        setSelectedCategories(newSelection);
        onSelectionChange(newSelection);
    };

    return (
        <Box sx={{
            flex: 1,
            width: '85%',
            margin: 'auto',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    {translate('ChooseCategories')}
                </AccordionSummary>
                <AccordionDetails sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '50vh',
                    overflowY: 'auto'
                }}>
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: theme.spacing(2),
                    }}>
                        <GrantCategories onSelectionChange={handleSelectionChange}/>
                        {error && <Alert severity="error" sx={{marginTop: theme.spacing(2)}}>{translate('ErrorMessage', { error })}</Alert>}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default GrantCategorySearchBoxComponent;
