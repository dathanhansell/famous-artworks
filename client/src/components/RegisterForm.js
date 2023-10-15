import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the register route
      const response = await axios.post("/api/register", {
        username,
        password,
        name,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <TextField
        variant="outlined"
        type="text"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        variant="outlined"
        type="text"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        variant="outlined"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="outlined" type="submit">
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
