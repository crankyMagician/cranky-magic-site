import React, {useEffect, useState} from 'react';
import axiosService from '../utilities/axios'; // Assuming axios is installed and used for HTTP requests
import GrantCategorySearchBoxComponent from './GrantCategorySearchBoxComponent';
import AgencyNameSearchBoxComponent from './AgencyNameSearchBoxComponent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert } from "@mui/material";
import SearchResults from "./SearchResults";
import { SuccessToast } from "./SuccessToast";
import { useTheme } from '@mui/material/styles';
import useCustomTranslation from "../hooks/useCustomTranslation";
const GrantSearchComponent = () => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const [selectedCategories, setSelectedCategories] = useState({});
    const [selectedAgencies, setSelectedAgencies] = useState({});
    const [searchResults, setSearchResults] = useState({
        items: [],
        totalCount: 0,
    });
    const [searchParams, setSearchParams] = useState({
        pageIndex: 0,
        pageSize: 10, // Default page size
        opportunityTitle: "",
        institutionsEligible: null,
        individualsEligible: null,
        nonprofitsEligible: null,
    });
    const [error, setError] = useState('');

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchUserId = () => {
        return 1; // Simulate fetching user ID, later from localStorage
    };
    useEffect(() => {
        // This function will be called on component mount
        performSearch();
    }, []); // Empty dependency array means it runs once on mount

    const handleCategorySelectionChange = (newSelection) => {
        setSelectedCategories(newSelection);
    };

    const handleAgencySelectionChange = (newSelection) => {
        setSelectedAgencies(newSelection);
    };

    const handleSearchParamChange = (event) => {
        const {name, value, checked, type} = event.target;
        setSearchParams(prevParams => ({
            ...prevParams,
            [name]: type === 'checkbox' ? (checked ? true : null) : value,
        }));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        performSearch(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0); // Reset to first page
        performSearch(0, +event.target.value);
    };

    const performSearch = (page = 1, rowsPerPage = 10) => {
        const userId = fetchUserId();
        let agencyNames = Object.values(selectedAgencies).filter(agency => agency.selected).map(agency => agency.name);
        let grantTags = Object.values(selectedCategories).filter(category => category.selected).map(category => ({
            categoryId: category.id,
            categoryName: category.name
        }));

        agencyNames = agencyNames.length > 0 ? agencyNames : null;
        grantTags = grantTags.length > 0 ? grantTags : null;

        const formattedSearchParams = {
            pageIndex: 1, // Set pageIndex to 1 for all searches
            pageSize: rowsPerPage,
            userId,
            opportunityTitle: searchParams.opportunityTitle || null,
            agencyNames,
            institutionsEligible: searchParams.institutionsEligible,
            individualsEligible: searchParams.individualsEligible,
            nonprofitsEligible: searchParams.nonprofitsEligible,
            grantTags,
            maxCount: 0
        };

        axiosService.post('/api/GrantSearchService/search', formattedSearchParams)
            .then(response => {
                console.log(response.data); // Or however your data is structured
                setSearchResults({
                    items: response.data.items, // Make sure this matches your actual data structure
                    totalCount: response.data.totalCount,
                });
            })
            .catch(error => {
                console.error('There was an error!', error);
                setError('Failed to fetch data. Please try again.');
            });

        // Optional: display search parameters or handle success
        SuccessToast(`Search executed with parameters: ${JSON.stringify(formattedSearchParams)}`);
        console.log(`${JSON.stringify(formattedSearchParams)}`);
    };



    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            overflow: 'auto'
        }}>
            <Box sx={{
                width: '85%',
                margin: 'auto',
                overflow: 'visible',
            }}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel-search-options-content"
                        id="panel-search-options-header"
                    >
                        {translate('SearchOptions')}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                            <TextField
                                label={translate('OpportunityTitleLabel')}
                                name="opportunityTitle"
                                value={searchParams.opportunityTitle}
                                onChange={handleSearchParamChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label={translate('PageSizeLabel')}
                                name="pageSize"
                                type="number"
                                value={searchParams.pageSize}
                                onChange={handleSearchParamChange}
                                margin="normal"
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch checked={searchParams.institutionsEligible === true}
                                                     onChange={handleSearchParamChange} name="institutionsEligible" />}
                                    label={translate('InstitutionsEligibleLabel')}
                                />
                                <FormControlLabel
                                    control={<Switch checked={searchParams.individualsEligible === true}
                                                     onChange={handleSearchParamChange} name="individualsEligible" />}
                                    label={translate('IndividualsEligibleLabel')}
                                />
                                <FormControlLabel
                                    control={<Switch checked={searchParams.nonprofitsEligible === true}
                                                     onChange={handleSearchParamChange} name="nonprofitsEligible" />}
                                    label={translate('NonprofitsEligibleLabel')}
                                />
                            </FormGroup>
                            <GrantCategorySearchBoxComponent onSelectionChange={handleCategorySelectionChange} />
                            <AgencyNameSearchBoxComponent onSelectionChange={handleAgencySelectionChange} />
                            {error && <Alert severity="error" sx={{ marginTop: theme.spacing(2) }}>{translate('ErrorMessage', { error })}</Alert>}
                        </Box>
                    </AccordionDetails>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                        <Button variant="outlined" onClick={performSearch}>
                            {translate('SearchButton')}
                        </Button>
                    </Box>
                </Accordion>
            </Box>
            <Box sx={{
                flex: 1,
                marginTop: 2,
                width: '85%',
                margin: 'auto',
                overflow: 'auto',
                maxHeight: 'calc(100vh - 200px)'
            }}>
                <SearchResults
                    data={searchResults}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={searchResults.totalCount}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Box>
        </Box>

    );

};
    export default GrantSearchComponent;
