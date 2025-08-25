import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Form, Container, Button, Input } from "./styled";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    localStorage.setItem("auth", JSON.stringify({ user: phone }));
    navigate("/", { replace: true });
  }

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
        />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
}
