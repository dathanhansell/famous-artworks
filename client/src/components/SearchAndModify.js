import React, { useState, useEffect } from "react";
import axios from "axios";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper, Checkbox, Grid, Box } from "@material-ui/core";
import DeleteDialog from './DeleteDialog';
import EditDialog from './EditDialog';
function SearchAndModify({ table1, table2, label }) {
    const [items1, setItems1] = useState([]);
    const [selectedItem1, setSelectedItem1] = useState(null);
    const [items2, setItems2] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:3001/${table1}/`)
            .then((response) => {
                const validItems = response.data.filter(item => item);
                setItems1(validItems);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }, [table1]);


    const handleSuggestionSelect = (event, value) => {
        setSelectedItem1(value);
        if (value) {
            axios
                .get(`http://localhost:3001/${table2}/${table1}/${value.id}`)
                .then((response) => {
                    setItems2(response.data);
                })
                .catch((error) => {
                    console.error("There was an error!", error);
                });
        }
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
            const newSelecteds = items2.map((n) => n.id);
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
        const deleteRequests = selected.map((id) => {
            return axios
                .delete(`http://localhost:3001/${table2}/${id}`)
                .then(() => {
                    console.log(`Deleted record with id: ${id}`);
                })
                .catch((error) => {
                    console.error(`Error deleting record with id ${id}: ${error}`);
                });
        });

        Promise.all(deleteRequests)
            .then(() => {
                // After all delete requests are complete, fetch the updated list of items
                handleSuggestionSelect("", selectedItem1); // Assuming fetchData is defined and updates your state with the latest data
                setSelected([]); // Clear selected items
            })
            .catch((error) => {
                console.error(`Error deleting records: ${error}`);
            });
    };
    const handleUpdate = (updatedData) => {
        const updateRequests = Object.entries(updatedData).map(([id, data]) => {
            return axios.put(`http://localhost:3001/${table2}/${id}`, data)
                .then(() => {
                    console.log(`Updated record with id ${id}`);
                })
                .catch((error) => {
                    console.error(`Error updating record with id ${id}: ${error}`);
                });
        });

        Promise.all(updateRequests)
            .then(() => {
                handleSuggestionSelect("", selectedItem1); // Assuming fetchData is defined and updates your state with the latest data
                setSelected([]);
            })
            .catch((error) => {
                console.error(`Error updating records: ${error}`);
            });
    };


    return (
        <div>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box flexGrow={1}>
                    <Autocomplete
                        id={`search-${table1}`}
                        options={items1}
                        getOptionLabel={(option) => option && typeof option.name === 'string' ? option.name : ""}
                        onChange={handleSuggestionSelect}
                        renderInput={(params) => <TextField {...params} label={`Search ${label}`} variant="outlined" fullWidth />}
                    />
                </Box>
                <Box ml={2}>
                    <DeleteDialog selected={selected} onDelete={handleDelete} />
                </Box>
                <Box ml={2}>
                    <EditDialog selected={selected} onUpdate={handleUpdate} table={table2} />
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selected.length > 0 && selected.length < items2.length}
                                checked={items2.length > 0 && selected.length === items2.length}
                                onChange={handleSelectAllClick}
                            />

                            </TableCell>
                            {items2[0] && Object.keys(items2[0]).map((key, index) => (
                                <TableCell key={index}>{key}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items2.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => {
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
                    count={items2.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
}

export default SearchAndModify;
