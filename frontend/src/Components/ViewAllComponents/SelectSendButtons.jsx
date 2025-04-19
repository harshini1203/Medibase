import React from "react";
import {
  SelectButton,
  SendButton,
  SelectSendButtonsWrapper,
} from "../Styles/ViewAllStyles";
import { AiOutlineCloudUpload, AiOutlineClose, AiOutlineSend } from "react-icons/ai";

const SelectSendButtons = ({
  selectionMode,
  setSelectionMode,
  selectedFiles,
  setSelectedFiles,
  showSendButton,
  showCancelButton,
  handleSendClick, // Use this function instead of directly sending files
}) => {
  const handleSelectClick = () => {
    setSelectionMode((prev) => !prev);
    if (!selectionMode) {
      setSelectedFiles([]);
    }
  };

  return (
    <>
      {showCancelButton && (
        <SelectSendButtonsWrapper>
          <SelectButton onClick={handleSelectClick}>
            {selectionMode ? (
              <>
                <AiOutlineClose size={30} /> Cancel
              </>
            ) : (
              <>
                <AiOutlineCloudUpload size={30} /> Select Files
              </>
            )}
          </SelectButton>
        </SelectSendButtonsWrapper>
      )}

      {showSendButton && (
        <SendButton onClick={handleSendClick}> {/* Now using handleSendClick */}
          <AiOutlineSend size={20} /> Send Selected Files
        </SendButton>
      )}
    </>
  );
};

export default SelectSendButtons;
