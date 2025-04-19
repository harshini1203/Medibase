import React from "react";
import { CustomDropdownMenu, CustomDropdownItem } from "../Styles/ViewAllStyles";

const ThreeDotMenu = ({ visible, position, onRename, onDelete, onChangeCategory,onDownload, onClose }) => {
  if (!visible) return null;

  return (
    <CustomDropdownMenu
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      onMouseLeave={onClose}
    >
      <CustomDropdownItem onClick={onRename}>Rename</CustomDropdownItem>
      <CustomDropdownItem onClick={onDelete}>Delete</CustomDropdownItem>
      <CustomDropdownItem onClick={onChangeCategory}>Change Category</CustomDropdownItem>
      <CustomDropdownItem onClick={onDownload}>Download file</CustomDropdownItem>
    </CustomDropdownMenu>
  );
};

export default ThreeDotMenu;
