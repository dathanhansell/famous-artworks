import React, { useState } from "react";
import {Toolbar, Typography, Button, Grid } from "@mui/material";
import RegisterForm from "./components/RegisterForm";
import ArtworkForm from "./components/ArtworkForm";
import ArtworkList from "./components/ArtworkList";
import ButtonAppBar from './components/MenuBar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestPage from "./page/testPage";
import LoginForm from "./components/LoginForm";



function HomePage() {
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

function App() {
  return (
    <Router>
      <ButtonAppBar/>
      <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path="/test" element={ <TestPage /> } />
        <Route path="/login" element={ <LoginForm /> } />
        <Route path="/register" element={ <RegisterForm /> } />
      </Routes>
    </Router>
  );
}

export default App;

