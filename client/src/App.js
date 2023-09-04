import React, { useState } from "react";
import ArtworkForm from "./components/ArtworkForm";
import ArtworkList from "./components/ArtworkList";

function App() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleArtworkClick = (artwork) => setSelectedArtwork(artwork);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="content">
            <div className="artwork-form">
              <h1>{selectedArtwork ? "Update Artwork" : "Add Artwork"}</h1>
              <ArtworkForm
                selectedArtwork={selectedArtwork}
                onArtworkUpdated={handleArtworkClick}
              />
            </div>
            <div className="artwork-list">
              <h1>Current Artwork</h1>
              <ArtworkList
                onArtworkClick={handleArtworkClick}
                onDeleteArtwork={() => setSelectedArtwork(null)}
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
