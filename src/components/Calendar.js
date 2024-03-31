import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Container, Typography, Box } from '@mui/material';
import useCustomTranslation from "../hooks/useCustomTranslation";

// Import locales
import esLocale from '@fullcalendar/core/locales/es'; // Spanish
import frLocale from '@fullcalendar/core/locales/fr'; // French
import deLocale from '@fullcalendar/core/locales/de'; // German
import itLocale from '@fullcalendar/core/locales/it'; // Italian
import jpLocale from '@fullcalendar/core/locales/ja'; // Japanese
import krLocale from '@fullcalendar/core/locales/ko'; // Korean
import ruLocale from '@fullcalendar/core/locales/ru'; // Russian
import zhLocale from '@fullcalendar/core/locales/zh-cn'; // Chinese Simplified
// Add more imports for other languages you support

const Calendar = ({ locale = 'en' }) => {
    const { translate } = useCustomTranslation();

    const handleDateClick = (arg) => {
        // This could be expanded to show more details or open a modal/dialog with event information
        alert(`Date clicked: ${arg.dateStr}`);
    };

    return (
        <Container component="main" maxWidth="xl">
            <Box sx={{ mt: 6, mb: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
                    {translate('Event Calendar')}
                </Typography>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek,dayGridDay'
                    }}
                    buttonText={{
                        today: translate('Today'),
                        month: translate('Month'),
                        week: translate('Week'),
                        day: translate('Day'),
                    }}
                    dateClick={handleDateClick}
                    locales={[esLocale, frLocale, deLocale, itLocale, jpLocale, krLocale, ruLocale, zhLocale]}
                    locale={locale}
                    contentHeight="auto" // Adjusts the calendar's height dynamically based on the events
                    aspectRatio={1.75} // Adjusts the calendar's aspect ratio (width to height)
                />
            </Box>
        </Container>
    );
};

export default Calendar;
