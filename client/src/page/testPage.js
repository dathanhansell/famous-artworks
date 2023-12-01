import React, { useState } from "react";
import { Grid } from "@mui/material";
import ArtworkForm from "../components/ArtworkForm";
import ArtworkList from "../components/ArtworkList";

function TestPage() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

    const handleArtworkClick = (artwork) => setSelectedArtwork(artwork);

    return (
        <div className="container">
            <Grid container className="content">
                <Grid item lg={6} className="artwork-form">
                    <h1>{selectedArtwork ? "Update Artwork" : "Add Artwork"}</h1>
                    <ArtworkForm
                        selectedArtwork={selectedArtwork}
                        onArtworkUpdated={handleArtworkClick}
                    />
                </Grid>
                <Grid item lg={6} className="artwork-list">
                    <h1>Current Artwork</h1>
                    <ArtworkList
                        onArtworkClick={handleArtworkClick}
                        onDeleteArtwork={() => setSelectedArtwork(null)}
                        selectedArtwork={selectedArtwork}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default TestPage;
