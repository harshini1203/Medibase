import React from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalInput,
  ModalButtonContainer,
  ModalButton,
  CloseButton,
} from "../Styles/ViewAllStyles";

const Modal = ({ visible, title, value, onChange, onClose, onSubmit, showInput = true }) => {
  if (!visible) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>{title}</ModalTitle>
        {/* Conditionally render the input field */}
        {showInput && (
          <ModalInput
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <ModalButtonContainer>
          <ModalButton cancel onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton onClick={onSubmit}>OK</ModalButton>
        </ModalButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
