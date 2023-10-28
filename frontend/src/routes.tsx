import { createBrowserRouter } from "react-router-dom";
import { Projects } from "./pages/Projects";
import { Login } from "./pages/Login";
import { Layout } from "./pages/Layout";
import { Search } from "./pages/Search";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Projects />
      },
      {
        path: "/search",
        element: <Search />
      }
    ]
  },
])
