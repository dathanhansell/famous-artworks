import React, { useState, useEffect } from "react";
import axios from 'axios';
import SearchAndModify from "../components/SearchAndModify";

function MuseumsPage() {

    return (
        <div>
            <SearchAndModify table1="museums" table2="artists" label="Artworks from artists" />
        </div>
    );
}

export default MuseumsPage;
