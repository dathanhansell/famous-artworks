import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

function ArtworkForm({ selectedArtwork, onArtworkUpdated }) {
  const [title, setTitle] = useState(
    selectedArtwork ? selectedArtwork.title : ""
  );
  const [year, setYear] = useState(selectedArtwork ? selectedArtwork.year : "");
  const [medium, setMedium] = useState(
    selectedArtwork ? selectedArtwork.medium : ""
  );

  useEffect(() => {
    setTitle(selectedArtwork ? selectedArtwork.title : "");
    setYear(selectedArtwork ? selectedArtwork.year : "");
    setMedium(selectedArtwork ? selectedArtwork.medium : "");
  }, [selectedArtwork]);

  async function handleSubmit(event) {
    event.preventDefault();

    const url = selectedArtwork
      ? `http://localhost:3001/artworks/${selectedArtwork.id}`
      : `http://localhost:3001/artworks`;

    const data = {
      title: title,
      year: year,
      medium: medium,
    };

    try {
      const response = selectedArtwork
        ? await axios.put(url, data)
        : await axios.post(url, data);

      if (response.status === 200) {
        alert(response.data);
      } else {
        throw new Error("Response status is not okay");
      }

      onArtworkUpdated(null);
      window.location.reload();
    } catch (err) {
      console.error("Error with axios:", err);
    }
  }

  const buttonText =
    selectedArtwork === null ? "Add Artwork" : "Update Artwork";

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title of Artwork"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Title of Artwork"
        required
      />
      <TextField
        label="Year of Creation"
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Enter Year of Creation"
        required
      />
      <TextField
        label="Medium"
        type="text"
        value={medium}
        onChange={(e) => setMedium(e.target.value)}
        placeholder="Enter Medium"
        required
      />
      <Button variant="contained" color="primary" type="submit">
        {buttonText}
      </Button>
    </form>
  );
}

export default ArtworkForm;
