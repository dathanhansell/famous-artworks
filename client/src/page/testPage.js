import React, { useState, useEffect } from "react";
import axios from 'axios';
import SearchAndModify from "../components/SearchAndModify";
import ModifyTable from "../components/ModifyTable";

function TestPage() {

    return (
        <div>
            <ModifyTable table="artists" label="Artworks from artists" />
        </div>
    );
}

export default TestPage;
