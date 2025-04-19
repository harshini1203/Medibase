import React from "react";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Login from "./Components/LoginComponents/Login";
import Home from "./Components/Home";
import ViewAllFiles from "./Components/viewAllFiles";
import AddCategory from "./Components/AddCategories";
import Help from "./Components/help";
import Navbar from "./Components/HomeComponents/navbar";
import VerifySession from "./Components/DoctorComponents/VerifySession";
import VerifyEmails from "./Components/VerifyEmails";
import ViewFilesByDoctor from "./Components/DoctorComponents/ViewFilesByDoctor";
import ActiveFiles from "./Components/DoctorComponents/ActiveFiles";
import ActiveChats from "./Components/DoctorComponents/ActiveChats";
import AddFilesPage from "./Components/ViewAllComponents/AddFilesPage";
import RegisterPage from "./Components/LoginComponents/RegisterPage";
import ForgotPassword from "./Components/LoginComponents/ForgotPassword";
import ResetPasswordPage from "./Components/LoginComponents/ResetPasswordPage";
import ProtectedRoute from "./Components/ProtectedRoute";

import "./Components/Styles/styles.css";

// Define a layout directly in App.js
const Layout = () => {
  return (
    <>
      <Navbar /> {/* Navbar is always visible */}
      <div className="main-container">
      <Outlet /> {/* This is where the child routes will be rendered */}
      </div>
    </>
  );
};
const router = createBrowserRouter([
  {
    path: "/", // Root path
    element: <Login />, // Default page is the Login component
  },
  {
    path: "/", // Main application layout
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ), // Use Layout as the parent route
    children: [
      { path: "home", element: <Home /> },
      { path: "viewAllFiles", element: <ViewAllFiles /> },
      { path: "addCategory", element: <AddCategory /> },
      { path: "help", element: <Help /> },
      { path: "verify-emails",element: <VerifyEmails />},
      { path: "active-chat/:userId/:doctorName", element: <ActiveFiles />},
      {path: "view-chats/:userId",element: <ActiveChats />},
      {path: "add-files/:userId/:doctorName",element: <AddFilesPage />},
    ],
  },
  {
    path: "/verify-email", // Independent route
    element: <VerifySession />, // No Navbar, displays separately
  },
  {
    path: "/view-files/:sessionId", // Independent route
    element: <ViewFilesByDoctor />, // No Navbar, displays separately
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path:"forgot-password",
    element: <ForgotPassword />,
  },
  {
    path:"reset-password",
    element:<ResetPasswordPage />,
  }
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

