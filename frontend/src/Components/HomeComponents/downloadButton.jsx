import React from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import styled from "styled-components";
import { FaDownload } from "react-icons/fa";

// Styled-components for the button
const DownloadBtn = styled.button`
  display: flex; /* Enables flexbox */
  align-items: center; /* Aligns items vertically */
  justify-content: center; /* Ensures content is centered */
  gap: 8px; /* Adds space between the icon and the text */
  padding: 10px 20px;
  background-color: #001C30;
  color: #DAFFFB;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background-color: #176B87;
  }
`;

const DownloadButton = ({ userId, fileName, downloadName }) => {
  const handleDownload = async () => {
    try {
      // Call the API to get the file
      const response = await axios.get(`http://localhost:3001/file/${userId}/${fileName}`, {
        responseType: "blob", // Important for handling binary data
      });

      // Use js-file-download to trigger download
      fileDownload(response.data, downloadName || fileName);
    } catch (error) {
      console.error("File download failed:", error.response?.data || error.message);
      alert("Failed to download file. Please try again.");
    }
  };

  return <DownloadBtn onClick={handleDownload}><FaDownload />Download</DownloadBtn>;
};

export default DownloadButton;
