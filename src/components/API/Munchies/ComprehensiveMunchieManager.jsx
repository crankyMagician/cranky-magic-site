import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Paper,
    Container,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useGetMunchieAllInfoByIdQuery } from '../../../api/apiSlice';
import MunchieDisplay from './MunchieDisplay';
import MunchieTypeManager from './MunchieTypeManager';
import MunchieAbilitiesManager from './MunchieAbilitiesManager';
import MunchieEvolutionManager from './MunchieEvolutionManager';
import MunchieLearnableMovesManager from './MunchieLearnableMovesManager';
import MunchieStatManager from './MunchieStatManager';
import MunchiePhotoEditor from '../MunchiePhotos/MunchiePhotoEditor';

const steps = [
    'Basic Information',
    'Manage Types',
    'Stats',
    'Abilities',
    'Evolution Chain',
    'Learnable Moves',
    'Edit Photo',
];

const ComprehensiveMunchieManager = () => {
    const { munchieId, munchieName } = useParams(); // Extract parameters from the route
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { data: munchieInfo, isLoading, isError } = useGetMunchieAllInfoByIdQuery(munchieId);

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            navigate('/munchie-grid'); // Navigate to the grid view after the last step
        } else {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <MunchieDisplay munchieId={munchieId} />;
            case 1:
                return <MunchieTypeManager munchieId={munchieId} />;
            case 2:
                return <MunchieStatManager munchieId={munchieId} />;
            case 3:
                return <MunchieAbilitiesManager munchieId={munchieId} />;
            case 4:
                return <MunchieEvolutionManager munchieId={munchieId} />;
            case 5:
                return <MunchieLearnableMovesManager munchieId={munchieId} munchieName={munchieName} />;
            case 6:
                return <MunchiePhotoEditor munchieId={munchieId} />;
            default:
                return 'Unknown step';
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Failed to load Munchie information
            </Alert>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Managing: {munchieName}
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ComprehensiveMunchieManager;
