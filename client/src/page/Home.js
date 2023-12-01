import React, { useState } from "react";
import { Grid } from "@mui/material";
import ArtworkForm from "../components/ArtworkForm";
import ArtworkList from "../components/ArtworkList";
import { red } from "@mui/material/colors";

function HomePage() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleArtworkClick = (artwork) => setSelectedArtwork(artwork);

  return (
    <div className="container">
      <Grid container className="content">
        <Grid
          style={{
            borderRadius: 8,
            border: "0.5px solid lightgray",
            height: "max-content",
            textAlign: "center",
            margin: 10,
          }}
          item
          lg={3}
          className="artwork-form"
        >
          <h1>{selectedArtwork ? "Update Artwork" : "Add Artwork"}</h1>
          <ArtworkForm
            selectedArtwork={selectedArtwork}
            onArtworkUpdated={handleArtworkClick}
          />
        </Grid>
        <Grid
          style={{
            borderRadius: 8,
            border: "0.5px solid lightgray",
            height: "max-content",
            textAlign: "center",
            margin: 10,
          }}
          item
          lg={6}
          className="artwork-list"
        >
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
export default HomePage;
