import React from "react";
import { NewButton } from "../Styles/HomeStyles";
import "../Styles/styles.css";
import { GrSelect } from "react-icons/gr";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function SelectFilesButton() {
  const navigate = useNavigate(); // Initialize navigate function

  const navigateTo = () => {
    navigate("/viewAllFiles?select=true"); // Navigate to the viewAllFiles route
  };

  return (
    <NewButton id="selectfilesbtn" onClick={navigateTo}>
      <GrSelect />
      SELECT FILES
    </NewButton>
  );
}

export default SelectFilesButton;
