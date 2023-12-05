import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, TextField, DialogTitle, Grid } from "@material-ui/core";
import { updateData } from "../dbOperations";
import RelationsDropdown from "./RelationsDropdown";
function EditDialog({ selected, onUpdate, table }) {
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
    const handleUpdate = async () => {
        // Merge formData and relationData
        const completeData = Object.keys(formData).reduce((result, id) => {
            result[id] = { ...formData[id], ...(relationData[id] || {}) };
            return result;
        }, {});
        

        try {
            const updateRequests = Object.keys(completeData).map((id) => {
                const url = `http://localhost:3001/${table}/${id}`;
                return axios.put(url, completeData[id]);
            });

            const responses = await Promise.all(updateRequests);

            responses.forEach((response, i) => {
                if (response.status !== 200) {
                    throw new Error(`Response status for record ${i} is not okay`);
                }
            });

            alert('All records updated successfully');
        } catch (err) {
            console.error("Error with axios:", err);
        }

        handleClose();
    };

    const handleChange = (id, name, event) => {
        setFormData(prevState => ({
            ...prevState,
            [id]: { ...prevState[id], [name]: event.target.value }
        }));
    };const handleRelationChange = (id, name, event) => {
        setRelationData(prevState => ({
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
                               {fields[table].map((field) => {
                            const relatedTable = relations[field];
                            return (
                                <Grid item xs={6} sm={3} key={field}>
                                    <RelationsDropdown
    id={item.id}
    table={relatedTable}
    value={relationData[item.id] && relationData[item.id][field] || ''}
    onChange={(event) => handleRelationChange(item.id, field, event)}
/>

                                </Grid>
                            );
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
