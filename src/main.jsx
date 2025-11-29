import { StrictMode } from 'react'
import './index.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ReactDOM from "react-dom/client";
import Chatbot from './Chatbot/Chatbot';

const router = createBrowserRouter([
   { path: "/", Component: Chatbot },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);
