import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the login route
      const response = await axios.post("/api/login", {
        username,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexFlow: "column",
        margin: 25,
        gap: 8,
        width: "25%",
        border: "0.5px solid lightgray",
        borderRadius: 10,
        padding: 25,
      }}
      onSubmit={handleLogin}
    >
      <TextField
        variant="filled"
        type="text"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        variant="filled"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        style={{ borderRadius: 25, backgroundColor: "#dcdcf3" }}
        color="primary"
        type="submit"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
