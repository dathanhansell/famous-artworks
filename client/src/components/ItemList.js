import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import {DeleteButton} from "./DeleteButton";

function ItemList({ items = [], selectedItem,setItems, onItemSelect, displayFields }) {
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [displayFieldsState, setDisplayFieldsState] = useState(displayFields);

    useEffect(() => {
        if (!displayFields && items.length > 0) {
            setDisplayFieldsState(Object.keys(items[0]));
        }
    }, [displayFields, items]);

    const sortedItems = [...items].sort((a, b) => {
        if (!sortField) return 0;
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    const handleItemDeleted = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {displayFieldsState && displayFieldsState.map(field => (
                            <TableCell key={field} onClick={() => handleSort(field)}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                {sortField === field && (sortDirection === 'asc' ? '▲' : '▼')}
                            </TableCell>
                        ))}
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedItems.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={displayFieldsState ? displayFieldsState.length + 1 : 1}>No Items Found</TableCell>

                        </TableRow>
                    ) : (
                        sortedItems.map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                style={{
                                    backgroundColor: selectedItem && selectedItem.id === item.id ? "#DDDDDD" : "",
                                }}
                                onClick={() => onItemSelect(item)}
                            >
                                {displayFieldsState && displayFieldsState.map(field => (
                                    <TableCell key={field}>{item[field]}</TableCell>
                                ))}
                                <TableCell>
                                    <DeleteButton id={item.id} endpoint="http://localhost:3001/artworks" onDeleted={handleItemDeleted} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ItemList;
