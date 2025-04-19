import styled from "styled-components";

export const StyledDisplayFiles = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #e8f0ff;
  ${'' /* background-color: #DAFFFB; */}
  color: #222831;

  h1 {
    font-size: 28px;
    margin-bottom: 30px;
    text-align: center;
    font-weight: bold;
  }

  .category-box {
    max-width: 800px;
    margin: 15px auto;
    padding: 20px;
    background: #f4f4f4;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: #e8f0ff;
    padding: 15px 20px;
    background-color: #001c30;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: #00334d;
      color: #ffffff;
    }
  }

  .toggle-icon {
    font-size: 20px;
    transition: transform 0.3s ease, color 0.3s ease;
    color: #e8f0ff;
    
    &.rotated {
      transform: rotate(180deg);
    }
  }

  .file-view-container {
    padding: 15px 20px;
    background: #f4f4f4;
    border-radius: 10px;
  }

  .file-view {
    display: flex;
    align-items: center;
    margin: 8px 0;
    padding: 12px;
    border-radius: 8px;
    background-color: #f4f4f4;
    color: #222831;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
    position: relative;

    &:hover {
      transform: scale(1.02);
    }
  }

  .file-checkbox {
    margin-right: 10px;
    height: 20px;
    width: 20px;
    cursor: pointer;
  }

  .file-icon {
    margin-right: 15px;
  }

  .file-details {
    flex-grow: 1;

    .file-name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .file-info {
      font-size: 14px;
      color: #222831;
    }
  }

  .file-options-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .file-options {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    margin-left: auto;

    &:hover {
      background-color: #eeeeee;
      cursor: pointer;
    }

    .dropdown-wrapper {
      position: absolute;
      top: 0;
      right: 100%;
      z-index: 1000;
    }
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .category-box {
      max-width: 90%;
      padding: 15px;
    }

    .category-header {
      font-size: 18px;
      padding: 10px 15px;
    }

    .file-view {
      padding: 10px;
    }

    .file-name {
      font-size: 14px;
    }

    .file-info {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .category-box {
      max-width: 95%;
    }

    .file-view {
      flex-direction: column;
      align-items: flex-start;
    }

    .file-icon {
      margin-bottom: 10px;
    }
  }
`;

export const StyledCategories = styled.div`
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  position: relative;

  h1 {
    text-align: center;
    font-size: 28px;
    color: #222831;
    margin-bottom: 20px;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;

    input {
      width: 90%;
      padding: 14px 16px;
      font-size: 18px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .add-button {
      text-align: center;
    }
  }

  .categories-list {
    list-style: none;
    padding: 0;
    width: 100%;

    .category-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px 20px;
      font-size: 18px;
      margin: 10px 0;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      color: #404247;
      transition: transform 0.2s ease;

      .category-name {
        font-weight: bold;
      }

      .file-count {
        font-size: 16px;
        color: #404247;
        margin-left: auto;
      }

      .file-options {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: background-color 0.3s ease;
        margin-left: 10px;

        &:hover {
          background-color: #eeeeee;
          cursor: pointer;
        }

        .dropdown-wrapper {
          position: absolute;
          top: 0;
          left: 100%;
          z-index: 1000;
          
        }         
      }
    }
  }

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 15px;

    h1 {
      font-size: 24px;
    }

    .categories-list .category-item {
      font-size: 16px;
    }

    input {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    max-width: 95%;
    padding: 10px;

    h1 {
      font-size: 20px;
    }

    .categories-list .category-item {
      padding: 10px 15px;
      font-size: 14px;
    }
  }
`;


export const DropdownMenu = styled.div`
  position: absolute;
  top: 0;
  left: 100%; /* Ensure dropdown opens to the right of the icon */
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 200px;
  z-index: 1000;
  display: ${(props) => (props.isVisible ? "block" : "none")};

  &::before {
    content: "";
    position: absolute;
    top: 12px;
    left: -8px; /* Align the arrow on the left */
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid #ffffff; /* Arrow points right */
  }
`;


export const DropdownItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const DropdownMenuCategory = styled(DropdownMenu)`
  width: 150px;
`;

export const DropdownItemCategory = styled(DropdownItem)``;

export const ButtonWrapper = styled.div`
  position: sticky;
  top: 80px; /* Stick to the top at 80px */
  left: 20px; /* Stick to the left */
  background: white;
  padding: 5px;
  width: fit-content; /* Adjust width based on button content */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow */
  background-color: #001c30;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.1); /* Slight scale on hover */
    background-color: #00334d; /* Slightly darker color */
  }
`;

// export const SelectButton = styled.button`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   padding: 10px 20px;
//   background-color: #001c30;
//   color: #dafffb;
//   border: none;
//   border-radius: 5px;
//   font-size: 22px;
//   cursor: pointer;
//   transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease;

//   &:hover {
//     background-color: #00334d;
//     color: #ffffff;
//     transform: scale(1.05);
//   }
// `;


// export const SendButton = styled.button`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   padding: 10px 20px;
//   background-color: #001c30;
//   color: #dafffb;
//   border: none;
//   border-radius: 5px;
//   font-size: 20px;
//   cursor: pointer;
//   transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease;
//   position: fixed; /* Position the button at the bottom-right corner */
//   bottom: 20px; /* Space from the bottom */
//   right: 20px; /* Space from the right */
//   z-index: 1000; /* Ensure it is above other elements */

//   &:hover {
//     background-color: #00334d;
//     color: #ffffff;
//     transform: scale(1.05);
//   }
// `;


// export const SelectSendButtonsWrapper = styled.div`
//   position: sticky;
//   top: 80px; /* Adjust for the navbar */
//   z-index: 1000;
//   display: flex;
//   gap: 15px;
//   padding: 10px;
// `;

export const SelectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #001c30;
  color: #e8f0ff;
  border: none;
  border-radius: 5px;
  font-size: 22px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #00334d;
    color: #ffffff;
    transform: scale(1.05);
  }
`;

export const SendButton = styled.button`
  position: fixed;
  bottom: 20px; /* Space from the bottom */
  right: 20px; /* Space from the right */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #001c30;
  color: #e8f0ff;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease;
  z-index: 2000; /* Ensure it appears above other elements */

  &:hover {
    background-color: #00334d;
    color: #ffffff;
    transform: scale(1.05);
  }
`;



export const AddCategoryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #001c30;
  color: #e8f0ff;
  border: none;
  border-radius: 5px;
  font-size: 21px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #00334d;
    color: #ffffff;
    transform: scale(1.05);
  }
`;

export const CustomDropdownMenu = styled.div`
  position: absolute;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px 0;
`;

export const CustomDropdownItem = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
`;

export const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

export const ModalInput = styled.input`
  width: calc(100% - 20px);
  padding: 12px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 3px #007bff;
  }
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const ModalButton = styled.button`
  padding: 10px 18px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s;

  ${(props) =>
    props.cancel
      ? `
    background: #f0f0f0;
    color: #333;

    &:hover {
      background: #e0e0e0;
    }
  `
      : `
    background: #007bff;
    color: white;

    &:hover {
      background: #0056b3;
    }
  `}
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 30px; /* Increased size */
  color: #999;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;



export const SelectSendButtonsWrapper = styled.div`
  position: sticky;
  top: 80px; /* Align with the HomeButton's top offset */
  z-index: 1000;
  padding: 10px 20px; /* Spacing for the container */
  display: flex;
  gap: 20px; /* Spacing between buttons */
  justify-content: flex-start; /* Align buttons to the left */
`;



export const ContentContainer = styled.div`
  flex: 1;
  padding: 0 20px;
  margin-top: 20px;
`;

// Align the input and button within the search bar row
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Add spacing between input and button */
`;

// Style the input to align well with the button
export const Input = styled.input`
  flex: 1; /* Take up available space */
  height: 40px;
  background: transparent; /* Ensure no background color */
  border: none; /* Remove the border completely */
  outline: none; /* Remove the outline on focus */
  font-size: 16px;
  color: #333;
  padding: 0 10px; /* Add padding for better spacing */

  &::placeholder {
    color: #aaa; /* Placeholder text color */
  }
`;



// Style the button to align with the input
export const Button = styled.button`
  background: #001c30;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #ffffff;
  width: 40px; /* Fixed width for circular shape */
  height: 40px; /* Fixed height for circular shape */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* Circular button */
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #00334d;
    transform: scale(1.1); /* Slightly enlarge on hover */
  }
`;

// Style the suggestion dropdown box
export const ResultBox = styled.div`
  position: absolute;
  top: 100%; /* Position below the input field */
  left: 0;
  width: 100%; /* Match the width of the SearchBox */
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 5px 0; /* Add space around the suggestions */
  z-index: 999; /* Ensure it's above other elements */

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 300px; /* Limit the height of the dropdown */
    overflow-y: auto; /* Enable vertical scrolling */
  }

  li {
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
      background-color: #e9f3ff;
      color: #007bff; /* Highlight text on hover */
    }
  }
`;

export const SearchBox = styled.div`
  position: relative;
  width: 400px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 15px;
  display: flex;
  flex-direction: column;
  left: 80px;
`;
export const NoResultsMessage = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 400px;
  background: white;
  padding: 15px;
  margin-top: 2px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 14px;
  color: #555;
  font-weight: bold;
  z-index: 998;
`;

export const CenteredSearchBar = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  z-index: 1000;
  padding-top: 70px; // Space for the main navbar
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: rgba(232, 240, 255, 0.8);
  backdrop-filter: blur(8px);
  z-index: 100;
  position: sticky;
  top: 70px;
  ${'' /* min-height: 60px; */}
  height: 60px;
  margin-bottom: 20px;
`;
export const DropdownMenuFiles = styled.div`
  position: absolute;
  top: 30px; /* Adjust the vertical position */
  left: 70px; /* Position to the right of the three dots */
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 150px;
  z-index: 1000;
  display: ${(props) => (props.isVisible ? "block" : "none")};
  display: ${(props) => (props.isVisible ? "block" : "none")};
`;



export const DropdownItemFile = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;
export const FileOptionsContainer = styled.div`
  position: relative;
  margin-left: 20px;
  display: flex;
  align-items: center;
`;
export const FileOptionsButton = styled.div`
  padding: 4px;
  cursor: pointer;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;