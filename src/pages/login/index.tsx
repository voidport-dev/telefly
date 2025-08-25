import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username) return;
    localStorage.setItem("auth", JSON.stringify({ user: username }));
    navigate("/", { replace: true });
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button type="submit">Login</button>
    </form>
  );
}
