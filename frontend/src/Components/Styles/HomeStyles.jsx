import styled from "styled-components";
import { Link } from "react-router-dom";
export const Container = styled.div`
  text-align: center;
  margin-top: 50px;
  display:flex;
  align-items: center;
  justify-content: center;
`;

export const NewButton = styled.button`
  display: flex; /* Enables flexbox */
  align-items: center; /* Aligns items vertically */
  justify-content: center; /* Ensures content is centered */
  gap: 8px; /* Adds space between the icon and the text */
  padding: 10px 20px;
  background-color: #001C30;
  color: #e8f0ff;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background-color: #176B87;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 10px;
  background-color: #e8f0ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #001C30
`;

export const ModalHeading = styled.h2`
  margin: 0 0 15px 0;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px; 
  right: 10px; 
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #001C30; 
  // padding: 5px 10px 5px 10px; 
  // border-radius: 40%; 
  // background-color: white; 
`;

// Wrapper for form elements
export const FormGroup = styled.div`
  margin: 15px 0;
  text-align: left;
`;

export const InputField = styled.input`
  width: 85%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f8f9fa; /* Light background color for better contrast */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle inner shadow */
  transition: all 0.3s ease; /* Smooth transitions for hover/focus states */

  &:focus {
    outline: none;
    border-color: #001C30; 
    background-color: #ffffff; /* Brighten the background on focus */
  }

  &:hover {
    border-color: #001C30; /* Green border on hover */
  }
`;

export const Dropdown = styled.select`
  width: 91%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f8f9fa; /* Light background color for better contrast */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle inner shadow */
  transition: all 0.3s ease; /* Smooth transitions for hover/focus states */
  &:hover {
    border-color: #001C30; /* Green border on hover */
  }
`;

export const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #001C30;
  color: #e8f0ff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;

  &:hover {
    background-color: #176B87;
  }
`;

export const NewButtonWrapper = styled.div`
position: absolute;
top: 60px;
left: 20px;
display: flex;
gap: 10px;
// background-color: green;
align-items: flex-end;
`;

// Styled component for the navbar
export const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: #001C30;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  z-index: 1000;
  color: white;
`;

export const NavItems = styled.div`
  display: flex;
  gap: 20px;
  padding-right: 100px;

  & > div {
    cursor: pointer;
  }
`;

export const ContentWrapper = styled.div`
  margin-top: 60px; /* Adjust this value based on Navbar height */
  padding: 20px;
  display: flex;
`;

export const BodyContainer = styled.div`
  padding-top: 60px; /* Ensures content starts below the fixed navbar */
  position: relative;
  background-color: #e8f0ff; /* Example: Light gray background */
  min-height: 100vh; /* Ensures the container spans the full viewport height */
`;

// Styled component for the logo
export const Logo = styled.div`
  font-size: 32px;
  cursor: pointer;
  color: #e8f0ff;
`;

export const StyledLink = styled(Link)`
  text-decoration: none; /* Remove underline */
  color: #e8f0ff; /* Default color */
  font-size: 18px; /* Adjust font size */
  padding: 10px 15px; /* Add spacing */
  transition: background-color 0.3s ease; /* Smooth hover effect */

  &.active {
    font-weight: bold;
    border-bottom: 2px solid #e8f0ff; /* Optional underline for emphasis */
  }

  &:hover {
    border-bottom: 1px solid #e8f0ff; 
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 22px; /* Space between grid items */
  padding: 20px;
  padding-right: 35px;
  padding-top: 7px;
  margin-top: 10px;
`;

export const FileBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* Position relative for absolute positioning of content */
  border: 4px solid #001C30; /* Border around each block */
  border-radius: 8px; /* Rounded corners */
  height: 250px; /* Fixed height for each block */
  text-align: center;
  // overflow: hidden; /* Clip any content that goes outside the block */
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #D9EAFD; /* Semi-transparent white background */

  &:hover {
    transform: scale(1.05); /* Slight zoom effect on hover */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  img, iframe, textarea {
    // position: absolute;
    // top: 0;
    // left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(1px); /* Apply the blur effect to the preview */
    z-index: 1; /* Place the preview behind all other content */
  }
`;

export const FileName = styled.div`
  position: absolute;
  top: 10px; /* 10px from the top */
  left: 10px; /* 10px from the left */
  font-size: 20px; /* Smaller font size */
  color: #001C30; /* Dark blue color */
  font-weight: bold;
  z-index: 2; /* Ensure the text appears above the blurred background */
`;

export const UploadDate = styled.div`
  position: absolute;
  bottom: 10px; /* 10px from the bottom */
  left: 10px; /* 10px from the left */
  font-size: 15px; /* Smaller font size */
  color: #001C30; /* Dark blue color */
  font-style: italic;
  z-index: 2; /* Ensure the text appears above the blurred background */
`;

export const ClickToViewButton = styled.div`
  position: absolute;
  bottom: 10px; /* 10px from the bottom */
  right: 10px; /* 10px from the right */
  font-size: 20px; /* Medium font size */
  font-style: italic;
  color: #001C30; /* Dark blue color */
  text-decoration: underline; /* Add underline to the text */
  cursor: pointer;

  &:hover {
    color: #176B87; /* Optional: Change color on hover */
  }

  z-index: 2; /* Ensure the button appears above the blurred background */
`;

export const GridHeading = styled.h3`
  font-size: 24px; /* Larger font size for prominence */
  font-weight: bold; /* Make the heading bold */
  color: #333; /* Dark gray color */
  padding-top: 10px;
  padding-left: 60px;
  margin-bottom: 0px;
  font-style: italic;
  text-decoration: underline;
`;

export const ViewMoreButton = styled.div`
  position: absolute; 
  right: 30px; /* 10px from the right */
  font-size: 20px; /* Medium font size */
  color: #001C30; /* Dark blue color */
  text-decoration: underline; /* Add underline to the text */
  cursor: pointer;

  &:hover {
    color: #176B87; /* Optional: Change color on hover */
  }

  z-index: 2; /* Ensure the button appears above the blurred background */
`;

export const NoFilesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 40px;
  font-weight: bold;
  color: #555;
  background-color:#DFCCFB;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px auto;
  width: 100%;
  text-align: center;
`;

export const UserIconContainer = styled.div`
  display: flex;
  cursor: pointer;
  z-index: 9999; 
`;

export const Dropdown2 = styled.div`
  position: absolute;
  top: 50px;
  right: 50px; /* Add space between dropdown and right edge */
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  min-width: 150px;
  padding: 10px 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;


export const DropdownItem2 = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #f5f5f5;
  }

  &:first-child {
    font-weight: bold;
    cursor: default;
    &:hover {
      background-color: white;
    }
  }
`;
