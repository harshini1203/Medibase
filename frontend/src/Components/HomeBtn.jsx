import React from "react";
import { FaHome } from "react-icons/fa"; // Importing the Home icon
import { useNavigate } from "react-router-dom";
import { ButtonWrapper, StyledButton } from "./Styles/OtherStyles";

function HomeButton({ isViewAllFilesPage, path = "/home" }) {
  const navigate = useNavigate();

  return (
    <ButtonWrapper isViewAllFilesPage={isViewAllFilesPage}>
      <StyledButton onClick={() => navigate(path)}>
        <FaHome />
      </StyledButton>
    </ButtonWrapper>
  );
}

export default HomeButton;
