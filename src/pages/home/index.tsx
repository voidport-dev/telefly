import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/login", { replace: true });
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
