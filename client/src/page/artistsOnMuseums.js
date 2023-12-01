import React, { useState, useEffect } from "react";
import axios from 'axios';
import SearchBar from "../components/SearchBar";
import ItemList from '../components/ItemList';

function MuseumsPage() {
    const [museums, setMuseums] = useState([]);
    const [selectedMuseum, setSelectedMuseum] = useState(null);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/muesums/')
            .then(response => {
                setMuseums(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleSuggestionSelect = (museum) => {
        setSelectedMuseum(museum);
        axios.get(`http://localhost:3001/artists/museums/${museum.id}`)
            .then(response => {
                setArtists(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    return (
        <div>
            <SearchBar onSuggestionSelected={handleSuggestionSelect} apiUrl={`/museums/search`} placeholder={"Search Mueums..."}/>
            <ItemList items={artists} onItemSelect={() => { }} onDeleteItem={() => { }} />
        </div>
    );
}

export default MuseumsPage;
