import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showSuccessToast,showErrorToast } from "../toastConfig";


const VerifySession = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Extract token from URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      setMessage("Invalid verification link.");
      setLoading(false);
      return;
    }

    // Call backend API to verify email
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/verify-email?token=${token}`
        );

        setMessage(response.data.message);
        showSuccessToast(response.data.message);
      } catch (error) {
        setMessage(error.response?.data?.error || "Verification failed.");
        showErrorToast(error.response?.data?.error || "Verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <ToastContainer />
      <h1>Email Verification</h1>
      {loading ? <p>Verifying...</p> : <p>{message} You can now exit this window.</p>}
    </div>
  );
};

export default VerifySession;

