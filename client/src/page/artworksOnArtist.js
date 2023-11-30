import React, { useState, useEffect } from "react";
import axios from 'axios';
import SelectItem from '../components/SelectItem';
import ItemList from '../components/ItemList';

function ArtworksPage() {
    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/artists/')
            .then(response => {
                setArtists(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleArtistSelect = (artist) => {
        setSelectedArtist(artist);
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
            <SelectItem items={artists} onSelect={handleArtistSelect} />
            <ItemList items={artworks} onItemSelect={() => { }} onDeleteItem={() => { }} />
        </div>
    );
}

export default ArtworksPage;
