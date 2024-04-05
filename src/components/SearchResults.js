import React, { useState } from 'react';
import {
    Checkbox,
    FormControlLabel,
    FormGroup

    ,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination, Accordion, AccordionSummary, Typography, AccordionDetails,
} from '@mui/material';
import PropTypes from 'prop-types';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useCustomTranslation from "../hooks/useCustomTranslation";

const columns = [
    { id: 'opportunityNumber', label: 'Opportunity Number', minWidth: 100 },
    { id: 'opportunityTitle', label: 'Title', minWidth: 200 },
    { id: 'opportunityCategory', label: 'Category', minWidth: 100 },
    { id: 'agencyName', label: 'Agency', minWidth: 100 },
    {
        id: 'postDate',
        label: 'Post Date',
        minWidth: 100,
        format: value => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
        id: 'closeDate',
        label: 'Close Date',
        minWidth: 100,
        format: value => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
        id: 'awardCeiling',
        label: 'Award Ceiling',
        minWidth: 100,
        format: (value) => value ? `$${value.toLocaleString()}` : 'N/A',
    },
    {
        id: 'awardFloor',
        label: 'Award Floor',
        minWidth: 100,
        format: (value) => value ? `$${value.toLocaleString()}` : 'N/A',
    },
    {
        id: 'estimatedTotalProgramFunding',
        label: 'Estimated Funding',
        minWidth: 120,
        format: (value) => value ? `$${value.toLocaleString()}` : 'N/A',
    },
    {
        id: 'description',
        label: 'Description',
        minWidth: 200,
        format: value => {
            if (!value) return 'N/A';
            const words = value.split(/\s+/);
            if (words.length > 300) {
                return `${words.slice(0, 300).join(' ')}...`;
            }
            return value;
        },
    },
    {
        id: 'additionalInformationURL',
        label: 'More Info',
        minWidth: 100,
        format: value => value ? <a href={value} target="_blank" rel="noopener noreferrer">Link</a> : 'N/A',
    },
    {
        id: 'grantorContactEmail',
        label: 'Contact Email',
        minWidth: 150,
        format: value => value ? <a href={`mailto:${value}`}>{value}</a> : 'N/A',
    },
];

function SearchResults({ data, page, rowsPerPage, totalCount, handleChangePage, handleChangeRowsPerPage }) {
    const defaultColumns = ['opportunityTitle', 'awardFloor', 'awardCeiling', 'grantorContactEmail'];
    const [selectedColumns, setSelectedColumns] = useState(defaultColumns);
    const { translate } = useCustomTranslation();
    const handleColumnToggle = (columnId) => {
        setSelectedColumns(prevSelectedColumns =>
            prevSelectedColumns.includes(columnId)
                ? prevSelectedColumns.filter(id => id !== columnId)
                : [...prevSelectedColumns, columnId]
        );
    };



// Define PropTypes
    SearchResults.propTypes = {
        data: PropTypes.shape({
            items: PropTypes.array.isRequired,
            // You might have more data properties that you could validate as needed
        }).isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired,
        totalCount: PropTypes.number.isRequired,
        handleChangePage: PropTypes.func.isRequired,
        handleChangeRowsPerPage: PropTypes.func.isRequired,
    };

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto' }}>
            {/* Column Selector in a Collapsible Accordion */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-columns-content"
                    id="panel-columns-header"
                >
                    <Typography>{translate('Column Selector')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup row sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                        {columns.map((column) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedColumns.includes(column.id)}
                                        onChange={() => handleColumnToggle(column.id)}
                                        name={column.label}
                                    />
                                }
                                label={column.label}
                                key={column.id}
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>


            <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.filter(column => selectedColumns.includes(column.id)).map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.items.map((row, index) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {columns.filter(column => selectedColumns.includes(column.id)).map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format ? column.format(value) : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={translate('Rows per page:')}
            />

        </Paper>
    );


}
export default SearchResults;
