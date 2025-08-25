import { RouterProvider, createHashRouter, redirect } from "react-router-dom";

import Home from "./pages/home/index.tsx";
import Login from "./pages/login/index.tsx";

const router = createHashRouter([
  {
    path: "/",
    loader: () => {
      const auth = localStorage.getItem("auth");
      if (!auth) throw redirect("/login");
      return null;
    },
    element: <Home />,
  },
  {
    path: "/login",
    loader: () => {
      const auth = localStorage.getItem("auth");
      if (auth) throw redirect("/");
      return null;
    },
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
