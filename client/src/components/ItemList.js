import React, { useState } from "react";
import { List, ListItem, ListItemText, Button, Paper } from "@mui/material";

function ItemList({ items, selectedItem, onItemSelect, onDeleteItem, displayFields }) {
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // If displayFields is not provided, get all the keys from the first item
    if (!displayFields && items.length > 0) {
        displayFields = Object.keys(items[0]);
    }

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
    }

    return (
        <div>
            <h2>List of Items</h2>
            <div>
                {displayFields.map(field => (
                    <Button key={field} onClick={() => handleSort(field)}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {sortField === field && (sortDirection === 'asc' ? '▲' : '▼')}
                    </Button>
                ))}
            </div>
            {sortedItems.length === 0 ? (
                <p>No Items Found</p>
            ) : (
                sortedItems.map((item, index) => (
                    <List key={index} component={Paper} className="mb-2">
                        <ListItem
                            button
                            variant="primary"
                            style={{
                                backgroundColor: selectedItem && selectedItem.id === item.id ? "#DDDDDD" : "",
                            }}
                            onClick={() => onItemSelect(item)}
                        >
                            {displayFields.map(field => (
                                <ListItemText key={field} primary={`${field.charAt(0).toUpperCase() + field.slice(1)}: ${item[field]}`} />
                            ))}
                            <Button onClick={() => onDeleteItem(item.id)}>Delete</Button>
                        </ListItem>
                    </List>
                ))
            )}
        </div>
    );
}

export default ItemList;
