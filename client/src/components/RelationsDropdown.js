import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

function RelationsDropdown({ table, onChange, value }) {
    const [records, setRecords] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:3001/${table}`)
            .then((response) => {
                setRecords(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching records: ${error}`);
            });
    }, [table]);

    return (
<Autocomplete
    id={table}
    options={records}
    getOptionLabel={(option) => option.name}
    value={value ? records.find((record) => record.id === value) : null}
    onChange={(event, newValue) => {
        onChange({
            target: {
                value: newValue ? newValue.id : "",
            },
        });
    }}
    renderInput={(params) => <TextField {...params} label={table} variant="outlined" />}
/>



    );
}

export default RelationsDropdown;
