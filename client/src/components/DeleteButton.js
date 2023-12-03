// DeleteButton.js
import React from 'react';
import { Button } from "@mui/material";
import axios from 'axios';

const DeleteButton = ({ id, endpoint, onDeleted }) => {
    const handleDelete = () => {
        axios
            .delete(`${endpoint}/${id}`)
            .then(() => {
                if (onDeleted) {
                    onDeleted(id);
                }
            })
            .catch((error) => {
                console.error(`Error deleting item: ${error}`);
            });
    };

    return (
        <Button onClick={handleDelete}>Delete</Button>
    );
};

export default DeleteButton;
