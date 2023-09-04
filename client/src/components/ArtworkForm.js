import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
function ArtworkForm({ selectedArtwork, onArtworkUpdated }) {
  const [artist, setArtist] = useState(
    selectedArtwork ? selectedArtwork.artist : ""
  );
  const [title, setTitle] = useState(
    selectedArtwork ? selectedArtwork.title : ""
  );
  const [dateOfCompletion, setDateOfCompletion] = useState(
    selectedArtwork ? selectedArtwork.dateOfCompletion : ""
  );
  const [country, setCountry] = useState(
    selectedArtwork ? selectedArtwork.country : ""
  );
  const [style, setStyle] = useState(
    selectedArtwork ? selectedArtwork.style : ""
  );
  const [location, setLocation] = useState(
    selectedArtwork ? selectedArtwork.location : ""
  );
  useEffect(() => {
    setArtist(selectedArtwork ? selectedArtwork.artist : "");
    setTitle(selectedArtwork ? selectedArtwork.title : "");
    setDateOfCompletion(selectedArtwork? selectedArtwork.dateOfCompletion:"");
    setCountry(selectedArtwork ? selectedArtwork.country : "");
    setStyle(selectedArtwork ? selectedArtwork.style : "");
    setLocation(selectedArtwork ? selectedArtwork.location : "");
  }, [selectedArtwork]);
  async function handleSubmit(event) {
    event.preventDefault();
    
    const url = selectedArtwork 
                ? `http://localhost:3001/artworks/${selectedArtwork.id}` 
                : `http://localhost:3001/artworks`;
  
    const data = {
      artist: artist,
      title: title,
      dateOfCompletion: dateOfCompletion,
      country: country,
      style: style,
      location: location,
    };
  
    try {
      const response = selectedArtwork
        ? await axios.put(url, data)
        : await axios.post(url, data);
  
      if (response.status === 200) {
        alert(response.data);
      } else {
        throw new Error('Response status is not okay');
      }
  
      onArtworkUpdated(null);
      window.location.reload();
    } catch (err) {
      console.error('Error with axios:', err);
    }
  }
  
  const buttonText = selectedArtwork === null ? "Add Artwork" : "Update Artwork";
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formArtist">
        <Form.Label>Artist</Form.Label>
        <Form.Control
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter Artist Name"
          required
        />
      </Form.Group>
      <Form.Group controlId="formTitle">
        <Form.Label>Title of Artwork</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title of Artwork"
          required
        />
      </Form.Group>
      <Form.Group controlId="formDateOfCompletion">
        <Form.Label>Date of Completion</Form.Label>
        <Form.Control
          type="text"
          value={dateOfCompletion}
          onChange={(e) => setDateOfCompletion(e.target.value)}
          placeholder="Enter Date of Completion"
          required
        />
      </Form.Group>
      <Form.Group controlId="formCountryOfArtist">
        <Form.Label>Country of Artist</Form.Label>
        <Form.Control
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Enter Country of Artist"
          required
        />
      </Form.Group>
      <Form.Group controlId="formStyleOfArt">
        <Form.Label>Style of Art</Form.Label>
        <Form.Control
          type="text"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          placeholder="Enter Style of Art"
          required
        />
      </Form.Group>
      <Form.Group controlId="formCurrentLocation">
        <Form.Label>Current Location of Artwork</Form.Label>
        <Form.Control
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Current Location of Artwork"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">{buttonText}</Button>
    </Form>
  );
}

export default ArtworkForm;
