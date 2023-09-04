import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';

function ArtworkForm() {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [dateOfCompletion, setDateOfCompletion] = useState("");
  const [country, setCountry] = useState("");
  const [style, setStyle] = useState("");
  const [location, setLocation] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist, title, dateOfCompletion, country, style, location }),
      });
      const message = await response.text();
      alert(message);
      window.location.reload();
    } catch (err) {
      console.error('Issue with fetch:', err);
    }
  }
  
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formArtist">
        <Form.Label>Artist</Form.Label>
        <Form.Control 
          type="text" 
          value={artist} 
          onChange={(e) => setArtist(e.target.value)} 
          placeholder="Enter Artist Name"
          required/>
      </Form.Group>
      <Form.Group controlId="formTitle">
        <Form.Label>Title of Artwork</Form.Label>
        <Form.Control 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter Title of Artwork"
          required/>
      </Form.Group>
      <Form.Group controlId="formDateOfCompletion">
        <Form.Label>Date of Completion</Form.Label>
        <Form.Control 
          type="text" 
          value={dateOfCompletion} 
          onChange={(e) => setDateOfCompletion(e.target.value)} 
          placeholder="Enter Date of Completion"
          required/>
      </Form.Group>
      <Form.Group controlId="formCountryOfArtist">
        <Form.Label>Country of Artist</Form.Label>
        <Form.Control 
          type="text" 
          value={country} 
          onChange={(e) => setCountry(e.target.value)} 
          placeholder="Enter Country of Artist"
          required/>
      </Form.Group>
      <Form.Group controlId="formStyleOfArt">
        <Form.Label>Style of Art</Form.Label>
        <Form.Control 
          type="text" 
          value={style} 
          onChange={(e) => setStyle(e.target.value)}
          placeholder="Enter Style of Art" 
          required/>
      </Form.Group>
      <Form.Group controlId="formCurrentLocation">
        <Form.Label>Current Location of Artwork</Form.Label>
        <Form.Control 
          type="text" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          placeholder="Enter Current Location of Artwork"
          required/>
      </Form.Group>
      
      <Button variant="primary" type="submit">Add Artwork</Button>
    </Form>
  );
}

export default ArtworkForm;
