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
        const deleteRequests = selected.map((id) => {
            return axios
                .delete(`http://localhost:3001/${table}/${id}`)
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
                load(table); // Assuming fetchData is defined and updates your state with the latest data
                setSelected([]); // Clear selected items
            })
            .catch((error) => {
                console.error(`Error deleting records: ${error}`);
            });
    };
    const handleUpdate = (updatedData) => {
        const updateRequests = Object.entries(updatedData).map(([id, data]) => {
            return axios.put(`http://localhost:3001/${table}/${id}`, data)
                .then(() => {
                    console.log(`Updated record with id ${id}`);
                })
                .catch((error) => {
                    console.error(`Error updating record with id ${id}: ${error}`);
                });
        });

        Promise.all(updateRequests)
            .then(() => {
                load(table); // Assuming fetchData is defined and updates your state with the latest data
                setSelected([]);
            })
            .catch((error) => {
                console.error(`Error updating records: ${error}`);
            });
    };
    const handleCreate = async (newData) => {
        const url = `http://localhost:3001/${table}`;
    
        try {
            const response = await axios.post(url, newData);
    
            if (response.status === 200) {
                alert(response.data);
            } else {
                throw new Error("Response status is not okay");
            }
    
            load(table);
        } catch (err) {
            console.error("Error with axios:", err);
        }
    };
    



    return (
        <div>
            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3}>
                <Box ml={2}>
                    <CreateDialog selected={selected} table={table} onCreate={handleCreate} />
                </Box>
                <Box ml={2}>
                    <DeleteDialog selected={selected} onDelete={handleDelete} />
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
