import React from "react";
import { List, ListItem, ListItemText, Paper } from "@mui/material";

function SelectItem({ items, onSelect, displayField = "name" }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        textAlign: "center",
        borderRadius: 10,
        width: "max-content",
        padding: "12px 40px",
      }}
    >
      <h2>Select an Artist</h2>
      {items.length === 0 ? (
        <p>No Artworks Found</p>
      ) : (
        items.map((item, index) => (
          <List
            style={{
              boxShadow: "none",
            }}
            key={index}
            component={Paper}
            className="mb-2"
          >
            <ListItem button onClick={() => onSelect(item)}>
              <ListItemText primary={item[displayField]} />
            </ListItem>
          </List>
        ))
      )}
    </div>
  );
}

export default SelectItem;
