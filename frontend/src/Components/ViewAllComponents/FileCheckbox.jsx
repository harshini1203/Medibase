import React from "react";

const FileCheckbox = ({ fileName, isSelected, onFileCheck }) => {
  return (
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onFileCheck(fileName)}
      style={{
        marginRight: "10px",
        height: "20px",
        width: "20px",
        cursor: "pointer",
      }}
    />
  );
};

export default FileCheckbox;
