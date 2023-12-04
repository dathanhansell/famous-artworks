import React, { useState, useEffect } from "react";
import SearchAndModify from "../components/SearchAndModify";
import { FormControl, Select, MenuItem, InputLabel, Grid, Button } from '@material-ui/core';

function SearchPage() {
    const [table1, setTable1] = useState("");
    const [table2, setTable2] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleChangeTable1 = (event) => {
        setTable1(event.target.value);
    };

    const handleChangeTable2 = (event) => {
        setTable2(event.target.value);
    };

    const handleClearTables = () => {
        setTable1("");
        setTable2("");
    };

    useEffect(() => {
        setRefreshKey(prevKey => prevKey + 1);
    }, [table1, table2])

    const tables = ["artists", "artworks", "museums", "art_periods", "art_styles", "collectors"];
    
    return (
        <div>
            
            <Grid container spacing={3} alignItems="center">
            <Grid item xs={1} sm={2}>
            <Button onClick={handleClearTables} variant="contained" color="secondary">Clear</Button>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <FormControl variant="filled" fullWidth>
                        <InputLabel>Table</InputLabel>
                        <Select value={table1} onChange={handleChangeTable1}>
                            {tables.filter(table => table !== table2).map(table => (
                                <MenuItem key={table} value={table}>{table.charAt(0).toUpperCase() + table.slice(1)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={1}>
                    <h3> From </h3>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <FormControl variant="filled" fullWidth>
                        <InputLabel>Table</InputLabel>
                        <Select value={table2} onChange={handleChangeTable2}>
                            {tables.filter(table => table !== table1).map(table => (
                                <MenuItem key={table} value={table}>{table.charAt(0).toUpperCase() + table.slice(1)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <SearchAndModify key={refreshKey} table1={table2} table2={table1} />
        </div>
    );
}

export default SearchPage;
