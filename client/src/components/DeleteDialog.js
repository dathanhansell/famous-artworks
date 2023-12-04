import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import axios from "axios";
function DeleteDialog({ selected, onDelete, table }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                onDelete();
            })
            .catch((error) => {
                console.error(`Error deleting records: ${error}`);
            });
        handleClose();
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleClickOpen} disabled={selected.length === 0}>
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete these records?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeleteDialog;
