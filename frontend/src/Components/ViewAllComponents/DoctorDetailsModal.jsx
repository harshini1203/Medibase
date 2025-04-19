import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalInput,
  ModalButtonContainer,
  ModalButton,
  CloseButton,
} from "../Styles/ViewAllStyles";
import styled from "styled-components";
import { showErrorToast } from "../toastConfig"; // Import toast function

// Styled dropdown (ModalSelect)
const ModalSelect = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #fff;
  color: #333;
  outline: none;
  cursor: pointer;

  option {
    font-size: 16px;
    color: #333;
  }
`;

const DoctorDetailsModal = ({ visible, onClose, onSubmit }) => {
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [verifiedEmails, setVerifiedEmails] = useState([]);
  const userId = localStorage.getItem("userId"); // Fetch user ID

  // Fetch verified doctor emails when modal opens
  useEffect(() => {
    if (!userId || !visible) return;

    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/fetch-emails/${userId}`
        );

        // Filter to only include verified emails
        const verifiedList = response.data.emails.filter(
          (emailObj) => emailObj.status === "verified"
        );

        setVerifiedEmails(verifiedList);
      } catch (error) {
        console.error("Error fetching emails:", error);
        setVerifiedEmails([]);
      }
    };

    fetchEmails();
  }, [userId, visible]);

  const handleSubmit = async () => {
    if (!doctorName || !doctorEmail) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    try {
      // Check if an active session exists with the same doctor email
      // const response = await axios.get(
      //   `http://localhost:3001/check-active-session/${userId}/${doctorEmail}`
      // );
  
      // if (response.data.error) {
      //   showErrorToast(response.data.error);
      //   return;
      // }

    onSubmit(doctorName, doctorEmail);

    // Clear input fields after submission
    setDoctorName("");
    setDoctorEmail("");
  }
  catch (error) {
    console.error("Error checking active session:", error);
    showErrorToast("Failed to check session. Please try again.");
  }
};

  if (!visible) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>Doctor's Details:</ModalTitle>

        {/* Doctor Name Input */}
        <ModalInput
          type="text"
          placeholder="Doctor Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />

        {/* Doctor Email Dropdown */}
        <ModalSelect
          value={doctorEmail}
          onChange={(e) => setDoctorEmail(e.target.value)}
        >
          <option value="">Select a Doctor Email</option>
          {verifiedEmails.length > 0 ? (
            verifiedEmails.map((emailObj, index) => (
              <option key={index} value={emailObj.email}>
                {emailObj.email}
              </option>
            ))
          ) : (
            <option disabled>No verified emails available</option>
          )}
        </ModalSelect>

        <ModalButtonContainer>
          <ModalButton cancel onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton onClick={handleSubmit} disabled={!doctorEmail}>
            OK
          </ModalButton>
        </ModalButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DoctorDetailsModal;
