import React from "react";
import { List, ListItem, ListItemText, Button, Paper } from "@mui/material";

function ItemList({ items, selectedItem, onItemSelect, onDeleteItem, displayFields }) {
    // If displayFields is not provided, get all the keys from the first item
    if (!displayFields && items.length > 0) {
        displayFields = Object.keys(items[0]);
    }

    return (
        <div>
            <h2>List of Items</h2>
            {items.length === 0 ? (
                <p>No Items Found</p>
            ) : (
                items.map((item, index) => (
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
