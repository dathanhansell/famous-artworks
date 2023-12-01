import React, { useState, useEffect } from "react";
import axios from 'axios';
import ItemList from '../components/ItemList';
import SearchBar from '../components/SearchBar';

function ArtworksPage() {
    const [artworks, setArtworks] = useState([]);

    const handleSuggestionSelect = (artist) => {
        axios.get(`http://localhost:3001/artworks/artists/${artist.id}`)
            .then(response => {
                setArtworks(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    return (
        <div>
            <SearchBar onSuggestionSelected={handleSuggestionSelect} apiUrl={`/artists/search`} placeholder={"Search Artists..."}/>
            <ItemList items={artworks} onItemSelect={() => { }} onDeleteItem={() => { }} />
        </div>
    );
}

export default ArtworksPage;
