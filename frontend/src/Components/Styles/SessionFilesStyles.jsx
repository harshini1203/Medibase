import styled from "styled-components";
import { ImBin } from "react-icons/im";

export const CenteredContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  background-color:#e8f0ff;
  padding-top: 80px;
`;

export const FileListContainer = styled.div`
  width: 80%;
  max-width: 500px;
  background: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display:flex;
  justify-content:center;
  flex-direction: column;
  align-items: center;
  margin-top:50px;
`;

export const FileCard = styled.div`
  display: flex;
  width: 88%;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.02);
  }
`;

export const FileIcon = styled.div`
  margin-right: 15px;
  font-size: 24px;
`;

export const FileDetails = styled.div`
  flex-grow: 1;
`;

export const DeleteIcon = styled(ImBin)`
  color: red;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;

export const ChatHeader = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 20px;
  padding: 15px 30px;
  background-color: #001C30;
  border-radius: 5px;
  display: inline-block;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #001c30;
  margin-bottom: 30px;
`;

export const TitleSmall = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #001C30;
  margin-bottom: 30px;
`;

export const AddFilesButton = styled.button`
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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #e8f0ff;
  padding-top: 80px;
`;



export const ChatList = styled.div`
  width: 80%;
  max-width: 500px;
  background: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top:100px;
`;

export const ChatCard = styled.div`
  width: 90%;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #001c30;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #cce7ff;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0px;
  margin-left:500px;
`;

export const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 130px;
  color: white;
  margin:20px;

  &:nth-child(1) {
    background: #001c30;
  }

  &:nth-child(2) {
    background: red;
  }
`;

export const AddMoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;  /* ✅ Ensures everything is centered */
  width: 100%;  /* ✅ Makes sure it spans the full width */
  max-width: 900px;  /* ✅ Matches the width of the file display */
  margin: 0 auto;  /* ✅ Centers the whole container */
  background: rgba(232, 240, 255, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  position: sticky;
  top: 70px;
  min-height: 20px;
  margin-bottom: 20px;
`;


export const CenteredSearchBarAddMoreFiles = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right:600px;
`;

export const TerminateSessionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px; /* Ensures consistent size */
  margin: 20px auto; /* Centers it dynamically */
  padding: 12px 20px;
  background-color: #d32f2f; /* Red background */
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #b71c1c; /* Darker red */
    transform: scale(1.05);
  }

  &:active {
    background-color: #ff4d4d; /* Slightly brighter red */
  }
`;

