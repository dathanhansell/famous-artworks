import React, { useState } from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Grid } from "@material-ui/core";
import RelationsDropdown from './RelationsDropdown';

function CreateDialog({ onCreate, table }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [relationData, setRelationData] = useState({}); // New state for relation data
    const relations = {
        "created_by": "artists",
        "lived_in": "art_periods",
        "belongs_to": "museums",
        "included_in": "art_periods",
        "owned_by": "collectors",
        "falls_under": "art_styles",
    };

    const fields = {
        "artists": ["lived_in"],
        "artworks": ["created_by", "belongs_to", "included_in", "owned_by", "falls_under"],
        "art_periods": [],
        "museums": [],
        "collectors": [],
        "art_styles": [],
    };
    const inverseRelations = Object.entries(relations).reduce(
        (obj, [key, value]) => ({ ...obj, [value]: key }),
        {}
    );

    const handleClickOpen = () => {
        // Fetch one record to get the fields
        axios.get(`http://localhost:3001/${table}/11`)
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
    function removeTrailingS(str) {
        return str.endsWith('s') ? str.slice(0, -1) : str;
    };
    function tableToID(str) {
        return removeTrailingS(str) + '_id';
    };
    const handleCreate = async () => {
        // Include both form data and relation data in the data being sent
        const dataToSend = { ...formData, ...relationData };
        console.log(dataToSend);
        const url = `http://localhost:3001/${table}`;

        try {
            const response = await axios.post(url, dataToSend);

            if (response.status === 200) {
                alert(response.data);
            } else {
                throw new Error("Response status is not okay");
            }
        } catch (err) {
            console.error("Error with axios:", err);
        }

        handleClose();
    };


    const handleChange = (name, event) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: event.target.value
        }));
    };

    const handleRelationChange = (name, event) => {
        setRelationData(prevState => ({
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
                        {fields[table].map((field) => {
                            const relatedTable = relations[field];
                            return (
                                <Grid item xs={6} sm={3} key={field}>
                                    <RelationsDropdown
                                        table={relatedTable}
                                        value={relationData[field] || ''}
                                        onChange={(event) => handleRelationChange(field, event)}
                                    />
                                </Grid>
                            );
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
