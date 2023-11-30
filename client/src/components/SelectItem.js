import React from "react";
import { List, ListItem, ListItemText, Paper } from "@mui/material";

function SelectItem({ items, onSelect, displayField = "name" }) {
    return (
        <div>
            <h2>Select an Item</h2>
            {items.length === 0 ? (
                <p>No Items Found</p>
            ) : (
                items.map((item, index) => (
                    <List key={index} component={Paper} className="mb-2">
                        <ListItem
                            button
                            onClick={() => onSelect(item)}
                        >
                            <ListItemText primary={item[displayField]} />
                        </ListItem>
                    </List>
                ))
            )}
        </div>
    );
}

export default SelectItem;
