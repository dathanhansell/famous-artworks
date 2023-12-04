import React, { useState } from "react";
import ModifyTable from "../components/ModifyTable";
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';

function ModifyPage() {
    const [table, setTable] = useState("artists");

    const handleChange = (event) => {
        setTable(event.target.value);
    };

    return (
        <div>
            <FormControl variant="filled">
                <InputLabel>Table</InputLabel>
                <Select value={table} onChange={handleChange}>
                    <MenuItem value={"artists"}>Artists</MenuItem>
                    <MenuItem value={"artworks"}>Artworks</MenuItem>
                    <MenuItem value={"museums"}>Museums</MenuItem>
                    <MenuItem value={"art_periods"}>Art Periods</MenuItem>
                    <MenuItem value={"art_styles"}>Art Styles</MenuItem>
                    <MenuItem value={"collectors"}>Collectors</MenuItem>
                    {/* Add more MenuItem components for each table in your database */}
                </Select>
            </FormControl>
            <ModifyTable table={table} label={`Artworks from ${table}`} />
        </div>
    );
}

export default ModifyPage;
