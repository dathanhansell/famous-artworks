import React from "react";
import {
  Fab,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ItemList({
  items,
  selectedItem,
  onItemSelect,
  onDeleteItem,
  displayFields,
}) {
  // If displayFields is not provided, get all the keys from the first item
  if (!displayFields && items.length > 0) {
    displayFields = Object.keys(items[0]);
  }

  return (
    <div style={{ margin: "12px 40px" }}>
      <h2>List of Artworks</h2>
      {items.length === 0 ? (
        <p>No Items Found</p>
      ) : (
        items.map((item, index) => (
          <List
            style={{ boxShadow: "none" }}
            key={index}
            component={Paper}
            className="mb-2"
          >
            <ListItem
              button
              variant="primary"
              style={{
                backgroundColor:
                  selectedItem && selectedItem.id === item.id ? "#DDDDDD" : "",
                display: "flex",
                flexFlow: "column",
                alignItems: "flex-start",
              }}
              onClick={() => onItemSelect(item)}
            >
              {displayFields.map((field) => (
                <ListItemText
                  key={field}
                  primary={`${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  }: ${item[field]}`}
                />
              ))}
              <Fab
                onClick={() => onDeleteItem(item.id)}
                size="small"
                aria-label="delete"
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                  boxShadow: "none",
                  alignSelf: "flex-end",
                }}
              >
                <DeleteIcon />
              </Fab>
            </ListItem>
          </List>
        ))
      )}
    </div>
  );
}

export default ItemList;
