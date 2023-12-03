import React, { useState } from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Grid } from "@material-ui/core";

function CreateDialog({ onCreate, table }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleClickOpen = () => {
        // Fetch one record to get the fields
        axios.get(`http://localhost:3001/${table}/1`)
            .then((response) => {
                // Create an object with the same keys as the record, but with empty values
                // Exclude the 'id' field
                const emptyFormData = Object.keys(response.data).reduce((obj, key) => {
                    if (key !== 'id') {
                        return { ...obj, [key]: '' };
                    }
                    return obj;
                }, {});

                setFormData(emptyFormData);
                setOpen(true);
            })
            .catch((error) => {
                console.error(`Error fetching record: ${error}`);
            });
    };


    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        // Exclude the 'id' field from the data being sent
        const dataToSend = Object.keys(formData).reduce((obj, key) => {
            if (key !== 'id') {
                return { ...obj, [key]: formData[key] };
            }
            return obj;
        }, {});

        onCreate(dataToSend);
        handleClose();
    };

    const handleChange = (name, event) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: event.target.value
        }));
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Create
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="form-dialog-title">Create New Record</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {Object.keys(formData).map((key) => {
                            if (key !== 'id') {
                                return (
                                    <Grid item xs={6} sm={3} key={key}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id={key}
                                            label={key}
                                            type="text"
                                            value={formData[key] || ''}
                                            fullWidth
                                            onChange={(event) => handleChange(key, event)}
                                        />
                                    </Grid>
                                );
                            }
                        })}

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreateDialog;
