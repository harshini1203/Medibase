import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Components/HomeComponents/ExtraComponents/Loading"; 
import { ToastContainer } from "react-toastify";
import { showWarningToast } from "./toastConfig";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // Initial session validation
  useEffect(() => {
    const verifySession = async () => {
      const sessionID = localStorage.getItem("sessionID");
      if (!sessionID) {
        showWarningToast("No session found. Please login again!");
        setTimeout(() => navigate("/"), 1500);
        return;
      }

      try {
        const res = await axios.post("http://localhost:3001/validate-user-session", {
          sessionID,
        });

        if (!res.data.valid) {
          localStorage.clear();
          showWarningToast("Session terminated, please login again!");
          setTimeout(() => navigate("/"), 1500);
        } else {
          setChecking(false);
        }
      } catch (err) {
        localStorage.clear();
        showWarningToast("Session Terminated. Please login again!");
        setTimeout(() => navigate("/"), 1500);
      }
    };

    verifySession();

    // Auto-recheck every 5 minutes (300,000 ms)
    const intervalId = setInterval(() => {
      verifySession();
    }, 300000); // 5 min

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  if (checking) {
    return (
      <>
        <Loading />
        <ToastContainer position="top-center" autoClose={2000} />
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      {children}
    </>
  );
};

export default ProtectedRoute;


