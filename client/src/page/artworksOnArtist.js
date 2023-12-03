import React, { useState, useEffect } from "react";
import axios from 'axios';
import SearchAndModify from "../components/SearchAndModify";

function ArtworksPage() {

    return (
        <div>
            <SearchAndModify table1="artists" table2="artworks" label="Artworks from artists" />
        </div>
    );
}

export default ArtworksPage;
