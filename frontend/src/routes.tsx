import { createBrowserRouter } from "react-router-dom";
import { Projects } from "./pages/Projects";
import { Login } from "./pages/Login";
import { Layout } from "./pages/Layout";
import { FolderDetail } from "./pages/FolderDetail";
import { AudioDetail } from "./pages/AudioDetail";

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
        path: "/folders/:id",
        element: <FolderDetail />
      },
      {
        path: "/audios/:id",
        element: <AudioDetail />
      },
    ]
  },
])
