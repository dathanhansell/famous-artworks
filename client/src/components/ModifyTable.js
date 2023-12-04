import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper, Checkbox, Box } from "@material-ui/core";
import DeleteDialog from './DeleteDialog';
import EditDialog from './EditDialog';
import CreateDialog from "./CreateDialog";

function ModifyTable({ table, label }) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        load(table);
    }, [table]);

    const load = (table) => {
        axios
            .get(`http://localhost:3001/${table}/`)
            .then((response) => {
                const validItems = response.data.filter(item => item);
                setItems(validItems);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = items.map((n) => n.id);
            setSelected(newSelecteds);
        } else {
            setSelected([]);
        }
    };

    const isSelected = (id) => {
        const foundIndex = selected.indexOf(id);
        return foundIndex !== -1;
    };


    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };


    const handleDelete = () => {
        console.log("deleted", selected);
        load(table); 
        setSelected([]); // Clear selected items
    };
    const handleUpdate = () => {
        load(table); //
        setSelected([]); 
    };

    return (
        <div>
            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3}>
                <Box ml={2}>
                    <CreateDialog selected={selected} table={table} onCreate={load(table)} />
                </Box>
                <Box ml={2}>
                    <DeleteDialog selected={selected} onDelete={handleDelete }table={table} />
                </Box>
                <Box ml={2}>
                    <EditDialog selected={selected} onUpdate={handleUpdate} table={table} />
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < items.length}
                                    checked={items.length > 0 && selected.length === items.length}
                                    onChange={handleSelectAllClick}
                                />

                            </TableCell>
                            {items[0] && Object.keys(items[0]).map((key, index) => (
                                <TableCell key={index}>{key}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => {
                            const isItemSelected = isSelected(row.id);
                            return (
                                <TableRow key={rowIndex}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isItemSelected}
                                            onChange={(event) => handleClick(event, row.id)}
                                        />
                                    </TableCell>
                                    {Object.keys(row).map((key, cellIndex) => (
                                        <TableCell key={cellIndex} component="th" scope="row">
                                            {row[key]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={items.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
}

export default ModifyTable;
