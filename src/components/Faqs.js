import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useCustomTranslation from "../hooks/useCustomTranslation";
const FAQs = () => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const faqs = [
        { id: 'faq1', question: translate('faq1_question'), answer: translate('faq1_answer') },
        { id: 'faq2', question: translate('faq2_question'), answer: translate('faq2_answer') },
        // Add more FAQs as needed
    ];

    return (
        <div>
            {faqs.map(faq => (
                <Accordion key={faq.id} sx={{
                    backgroundColor: theme.palette.background.paper, // Use theme for background
                    color: theme.palette.text.primary, // Use theme for text color
                    margin: theme.spacing(2, 0), // Use theme spacing for margin
                }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                        backgroundColor: theme.palette.primary.light, // Use theme for summary background
                        color: theme.palette.primary.contrastText, // Contrast text for readability
                    }}>
                        <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{
                        backgroundColor: theme.palette.background.default, // Different background for details
                    }}>
                        <Typography>
                            {faq.answer}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default FAQs;
