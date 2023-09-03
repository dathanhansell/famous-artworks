import React, { useState } from "react";

function ArtworkForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const message = await response.text();
      alert(message);
  
    } catch (err) {
      console.error('Issue with fetch:', err);
    }
  }
  

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Artwork</button>
    </form>
  );
}

export default ArtworkForm;
//..
