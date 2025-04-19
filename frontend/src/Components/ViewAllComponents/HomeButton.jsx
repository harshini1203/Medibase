import React from "react";
import { AiOutlineHome } from "react-icons/ai"; // Import a home-related icon
import { useNavigate } from "react-router-dom"; // Use React Router for navigation
import "../Styles/styles.css";
import { HomeButton } from "../Styles/ViewAllStyles";

const ViewPage = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleHomeButtonClick = () => {
    navigate("/home"); // Navigate to /home
  };

  return (
    <div>
      <HomeButton onClick={handleHomeButtonClick}>
        <AiOutlineHome size={30} /> Go Home
      </HomeButton>
    </div>
  );
};

export default ViewPage;
