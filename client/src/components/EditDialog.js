import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Grid } from "@material-ui/core";

function EditDialog({ selected, onUpdate, table }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleClickOpen = () => {
        // Fetch the data when the dialog is opened
        const fetchRequests = selected.map((id) => {
            return axios.get(`http://localhost:3001/${table}/${id}`)
                .then((response) => {
                    return { [id]: response.data };
                })
                .catch((error) => {
                    console.error(`Error fetching record with id ${id}: ${error}`);
                });
        });

        Promise.all(fetchRequests)
            .then((results) => {
                // Combine all the results into one object
                const combinedResults = results.reduce((obj, result) => ({ ...obj, ...result }), {});
                setFormData(combinedResults);
                setOpen(true);
                
            })
            .catch((error) => {
                console.error(`Error fetching records: ${error}`);
            });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate = () => {
        const updateRequests = Object.entries(formData).map(([id, data]) => {
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
                onUpdate();
            })
            .catch((error) => {
                console.error(`Error updating records: ${error}`);
            });
        handleClose();
    };

    const handleChange = (id, name, event) => {
        setFormData(prevState => ({
            ...prevState,
            [id]: { ...prevState[id], [name]: event.target.value }
        }));
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleClickOpen} disabled={selected.length === 0}>
                Modify
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="form-dialog-title">Edit Records</DialogTitle>
                {Object.values(formData).map(item => (
                    <DialogContent key={item.id}>
                        <Grid container spacing={2}>
                            {Object.keys(item).map((key) => {
                                if (key !== 'id') {
                                    return (
                                        <Grid item xs={6} sm={3} key={key}>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id={key}
                                                label={key}
                                                type="text"
                                                value={formData[item.id][key] || ''}
                                                fullWidth
                                                onChange={(event) => handleChange(item.id, key, event)}
                                            />
                                        </Grid>
                                    );
                                }
                            })}

                        </Grid>
                    </DialogContent>
                ))}
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EditDialog;
