import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Ensure styles are imported
import FileCheckbox from "./FileCheckbox"; // Import your custom checkbox component

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const FileList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin: 15px 0;
  text-align: left;
`;

const FileItem = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 45%;
  color: white;

  &:nth-child(1) {
    background: #001c30;
  }

  &:nth-child(2) {
    background: red;
  }
`;

const AddFilesModal = ({ userId, doctorName, closeModal, refreshFiles }) => {
  const [availableFiles, setAvailableFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchAvailableFiles = async () => {
      try {
        // Get all user files
        const userFilesResponse = await axios.get(`http://localhost:3001/getFiles/${userId}`);
        const userFiles = userFilesResponse.data.files;

        // Get session files
        const encodedDoctorName = encodeURIComponent(doctorName);
        const sessionFilesResponse = await axios.get(`http://localhost:3001/getSessionFiles/${userId}/${encodedDoctorName}`);
        const sessionFiles = sessionFilesResponse.data.map(file => file.filename);

        // Filter out files already in the session
        const filteredFiles = userFiles.filter(file => !sessionFiles.includes(file));

        setAvailableFiles(filteredFiles);
      } catch (error) {
        console.error("Error fetching available files:", error);
        toast.error("Failed to load available files."); // 🔴 Show error toast
      }
    };

    fetchAvailableFiles();
  }, [userId, doctorName]);

  const handleFileSelect = (fileName) => {
    setSelectedFiles((prev) =>
      prev.includes(fileName) ? prev.filter((f) => f !== fileName) : [...prev, fileName]
    );
  };

  const handleAddFiles = async () => {
    try {
      if (selectedFiles.length === 0) {
        toast.warn("Please select at least one file."); // ⚠️ Show warning toast
        return;
      }

      await axios.post(`http://localhost:3001/addFilesToSession/${userId}/${doctorName}`, {
        selectedFiles, // Fix: Ensure backend gets the expected key
      });
      refreshFiles(); // ✅ Refresh the session list immediately
      closeModal(); // Close modal
      toast.success("Files added successfully!");
    } catch (error) {
      console.error("Error adding files to session:", error);
      toast.error("Failed to add files. Please try again."); // 🔴 Show error toast
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Select Files to Add</h3>
        <FileList>
          {availableFiles.length > 0 ? (
            availableFiles.map((file, index) => (
              <FileItem key={index}>
                <span>{file}</span>
                <FileCheckbox fileName={file} isSelected={selectedFiles.includes(file)} onFileCheck={handleFileSelect} />
              </FileItem>
            ))
          ) : (
            <p>No files available</p>
          )}
        </FileList>
        <ButtonContainer>
          <Button onClick={handleAddFiles}>Add</Button>
          <Button onClick={closeModal}>Cancel</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddFilesModal;
