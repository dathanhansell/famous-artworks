// dbOperations.js
import axios from 'axios';
export const getTotalCount = (table, setItems) => {
    if ([table, setItems].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
    axios.get(`http://localhost:3001/${table}/api/count`)
        .then((response) => {
            setItems(response.data);
        })
        .catch((error) => {
            console.error(`Error fetching museums: ${error}`);
        }
        );
}
export const loadAvg = (table1, table2, setItems) => {
    if ([table1, table2, setItems].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
    axios.get(`http://localhost:3001/${table1}/avg_${table2}`)
        .then((response) => {
            setItems(response.data);
        })
        .catch((error) => {
            console.error(`Error fetching museums: ${error}`);
        }
        );
}


export const loadWithMost = (table1, table2, setItems, limit) => {
    if ([table1, table2, setItems].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
    axios.get(`http://localhost:3001/${table1}/most_${table2}?limit=${limit}`)
        .then((response) => {
            setItems(response.data);
        })
        .catch((error) => {
            console.error(`Error fetching museums: ${error}`);
        });
}
export const loadSortedData = (table, setItems, sort, direction, limit) => {
    if ([table, setItems, sort, direction, limit].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
    axios.get(`http://localhost:3001/${table}?sort=${sort}&direction=${direction}&limit=${limit}`)
    .then((response) => {
        setItems(response.data.data);
    })
    .catch((error) => {
        console.error(`Error fetching artists: ${error}`);
    });
}
export const loadSpecificData = (table, setItems, id = '') => {
    if ([table, setItems].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }

    axios
        .get(`http://localhost:3001/${table}/${id}`)
        .then((response) => {
            console.log(response.data.data);
            setItems(response.data.data);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};
export const loadMuseumsByArtPeriod = (artPeriodId, setItems, sort='location', direction='DESC', limit=5) => {
    if ([artPeriodId, setItems, sort, direction, limit].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
    axios.get(`http://localhost:3001/museums/art_periods/1?sort=location&direction=DESC&limit=5`)
    .then(response => {
       
        setItems(response.data);
    })
    .catch(error => {
        console.error(`Error fetching museums by art period: ${error}`);
    });
}

export const loadData = (table, setItems) => {
    if ([table, setItems].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
    axios
        .get(`http://localhost:3001/${table}/`)
        .then((response) => {
            const validItems = response.data.data.filter(item => item);
            console.log(response.data.data);
            setItems(validItems);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};
export const loadRelations = (table1, table2, setItems,value) => {
    if ([table1, table2, setItems,value].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
    axios
        .get(`http://localhost:3001/${table2}/${table1}/${value.id}`)
        .then((response) => {
            console.log(response.data);
            setItems(response.data);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

export const getLowestValue=(setItem,attr,table)=> {
    axios.get(`http://localhost:3001/${table}?sort=${attr}&limit=1&direction=DESC` )
    .then(response => {
        setItem(response.data.data[0]);
    })
    .catch(error => {
        console.error("Error fetching oldest artist:", error);
    });
}
export const getMostCommonValue=(setItem,attr,table)=> {
    axios.get(`http://localhost:3001/${table}/most_common/${attr}` )
    .then(response => {
        setItem(response.data[attr]);
    })
    .catch(error => {
        console.error("Error fetching oldest artist:", error);
    });
}

export const createData = (table, dataToSend, onCreate) => {
    if ([table, dataToSend].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
    const url = `http://localhost:3001/${table}`;

    axios.post(url, dataToSend)
        .then((response) => {
            if (response.status === 200) {
                alert(response.data.data);
                onCreate();  // Call the onCreate callback
            } else {
                throw new Error("Response status is not okay");
            }
        })
        .catch((err) => {
            console.error("Error with axios:", err);
        })
};
export const deleteData = (table, selected, onDelete) => {
    if ([table, selected].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
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
};

export const updateData = (table, formData, onUpdate) => {
    if ([table, formData].includes(undefined)) {
        console.warn("One or more parameters are undefined");
        return;
    }
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
};
