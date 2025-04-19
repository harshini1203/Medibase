import React, { useEffect, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import Loading from "../HomeComponents/ExtraComponents/Loading";
import ViewFileButton from "./ViewFile";
import { AiFillFilePdf, AiFillFileImage } from "react-icons/ai";
import { FaChevronDown, FaEllipsisV } from "react-icons/fa";
import { StyledDisplayFiles,DropdownMenuCategory,DropdownItemCategory, DropdownItemFile,DropdownMenuFiles,FileOptionsButton,FileOptionsContainer } from "../Styles/ViewAllStyles";
import "../Styles/styles.css";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "../toastConfig";
import Modal from "./Modal";
import FileCheckbox from "./FileCheckbox";
import NoFilesFound from "../HomeComponents/ExtraComponents/NoFiles"; 

const DisplayFiles = ({
  searchQuery,
  searchTriggered,
  selectionMode,
  selectedIds,
  setSelectedIds,
  selectedFiles,
  setSelectedFiles,
}) => {
  const userId = localStorage.getItem("userId");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalState, setModalState] = useState({
    visible: false,
    type: "",
    fileId: null,
    inputValue: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!userId) {
          console.error("User ID is missing.");
          return;
        }
        const response = await axios.get(`http://localhost:3001/categories/${userId}`);
        setCategories(response.data);
        setFilteredCategories(response.data);
        const initialExpandedState = response.data.reduce((acc, category) => {
          acc[category.categoryName] = true;
          return acc;
        }, {});
        setExpandedCategories(initialExpandedState);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  });

  useEffect(() => {
    // Expand all categories when selectionMode is toggled
    if (selectionMode) {
      const expandedState = categories.reduce((acc, category) => {
        acc[category.categoryName] = true;
        return acc;
      }, {});
      setExpandedCategories(expandedState);
    }
  }, [selectionMode, categories]);
  

  useEffect(() => {
    if (searchTriggered && searchQuery) {
      const newFilteredCategories = categories
        .map((category) => ({
          ...category,
          files: category.files.filter((file) =>
            file.filename.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.files.length > 0);
      setFilteredCategories(newFilteredCategories);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, searchTriggered, categories]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const hasFiles = filteredCategories.some((category) => category.files.length > 0);
  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleFileCheck = async (fileName) => {
    setSelectedFiles((prev) =>
      prev.includes(fileName)
        ? prev.filter((file) => file !== fileName)
        : [...prev, fileName]
    );
  
    try {
      const response = await axios.get(`http://localhost:3001/getFileId/${userId}/${fileName}`);
  
      if (response.status === 200) {
        const fileId = response.data.fileId;
  
        setSelectedIds((prev) => {
          const updatedIds = prev.includes(fileId)
            ? prev.filter((id) => id !== fileId)
            : [...prev, fileId];
  
          console.log("Setting selectedIds:", updatedIds); // ✅ Log correct value before setting state
          return updatedIds;
        });
      }
    } catch (error) {
      console.error("Error fetching file ID:", error);
    }
  };

  const handleFileView = async (fileName) => {
    if (selectionMode) return;
    try {
      await axios.post("http://localhost:3001/clickToView", { filename: fileName });
      console.log(`File clicked for viewing: ${fileName}`);
    } catch (error) {
      console.error("Error sending file view request:", error);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:3001/file/${userId}/${fileName}`, {
        responseType: "blob",
      });
      const contentType = response.headers["content-type"];
      const fileExtension = contentType.split(";")[0].split("/")[1];
      const downloadName = `${fileName}.${fileExtension}`;
      fileDownload(response.data, downloadName);
      showSuccessToast("File downloaded successfully.");
    } catch (error) {
      console.error("File download failed:", error.message);
      showErrorToast("Failed to download the file. Please try again.");
    }
  };

  const handleRename = (fileId) => {
    setModalState({
      visible: true,
      type: "rename",
      fileId,
      inputValue: fileId,
    });
    setDropdownOpen(null);
  };

  const handleDelete = (fileId) => {
    setModalState({
      visible: true,
      type: "delete",
      fileId,
      inputValue: "",
    });
    setDropdownOpen(null);
  };
  const handleChangeCategory = (fileId) => {
    setModalState({
      visible: true,
      type: "changeCategory",
      fileId,
      inputValue: "", // Empty for new category input
    });
    setDropdownOpen(null);
    
  };
  const handleModalSubmit = async () => {
    try {
      if (modalState.type === "rename") {
        // Rename the file
        await axios.post(`http://localhost:3001/renameFile/${userId}`, {
          fileId: modalState.fileId,
          newName: modalState.inputValue,
        });
  
        // Update the local categories state
        setCategories((prevCategories) =>
          prevCategories.map((category) => ({
            ...category,
            files: category.files.map((file) =>
              file.filename === modalState.fileId
                ? { ...file, filename: modalState.inputValue }
                : file
            ),
          }))
        );
  
        showSuccessToast("File renamed successfully.");
      } else if (modalState.type === "changeCategory") {
        // Change the file category
        await axios.post(`http://localhost:3001/changeFileCategory/${userId}`, {
          fileId: modalState.fileId,
          newCategory: modalState.inputValue,
        });
  
        // Update the local categories state
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          let fileToMove = null;
  
          // Remove file from the old category
          for (const category of updatedCategories) {
            category.files = category.files.filter((file) => {
              if (file.filename === modalState.fileId) {
                fileToMove = file; // Save the file to move
                return false;
              }
              return true;
            });
          }
  
          // Add file to the new category
          const targetCategory = updatedCategories.find(
            (cat) => cat.categoryName === modalState.inputValue
          );
          if (targetCategory && fileToMove) {
            targetCategory.files.push({
              ...fileToMove,
              category: modalState.inputValue,
            });
          }
  
          return updatedCategories;
        });
  
        showSuccessToast("Category changed successfully.");
      } else if (modalState.type === "delete") {
        // Delete the file
        await axios.delete(`http://localhost:3001/deleteFile/${userId}`, {
          data: { fileId: modalState.fileId },
        });
  
        // Update the local categories state
        setCategories((prevCategories) =>
          prevCategories.map((category) => ({
            ...category,
            files: category.files.filter(
              (file) => file.filename !== modalState.fileId
            ),
          }))
        );
  
        showSuccessToast("File deleted successfully.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "A file with this name already exists."
      ) {
        showErrorToast("A file with this name already exists."); // Show specific error message
      } else {
        showErrorToast("An error occurred. Please try again."); // Default error message
      }
    } finally {
      setModalState({ visible: false, type: "", fileId: null, inputValue: "" });
    }
  };
  
  

  if (loading) {
    return <Loading />;
  }
  if (!hasFiles) {
    return <NoFilesFound />; // Render NoFilesFound when no files exist
  }

  return (
    <StyledDisplayFiles>
      <ToastContainer />
      <div className="suggested-files">
        {filteredCategories.map((category) => (
          <div key={category.categoryName} className="category-box">
            <h2
              className="category-header"
              onClick={() => toggleCategory(category.categoryName)}
            >
              {category.categoryName}
              <FaChevronDown
                className={`toggle-icon ${
                  expandedCategories[category.categoryName] ? "rotated" : ""
                }`}
              />
            </h2>
            {expandedCategories[category.categoryName] && (
              <div className="file-view-container">
                {category.files.map((file, index) => (
                  <div
                    key={index}
                    className="file-view"
                    onClick={() => handleFileView(file.filename)}
                  >
                    {selectionMode && (
                      <FileCheckbox
                        fileName={file.filename}
                        isSelected={selectedFiles.includes(file.filename)}
                        onFileCheck={handleFileCheck}
                      />
                    )}
                    <div className="file-icon">
                      {file.contentType.startsWith("image") ? (
                        <AiFillFileImage size={24} color="#4CAF50" />
                      ) : (
                        <AiFillFilePdf size={24} color="#F44336" />
                      )}
                    </div>
                    <div className="file-details">
                      <ViewFileButton
                        userId={userId}
                        fileName={file.filename}
                        setLoading={setLoading}
                      />
                      <div className="file-info">
                        {file.uploadDate
                          ? `Uploaded • ${formatDate(file.uploadDate)}`
                          : "N/A"}
                      </div>
                    </div>
                    <FileOptionsContainer
                          onMouseLeave={() => setDropdownOpen(null)} // Close dropdown when mouse leaves
                        >
                          <div
                            className="file-options"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === file.filename ? null : file.filename);
                            }}
                          >
                            <FaEllipsisV size={20} />
                            <DropdownMenuCategory isVisible={dropdownOpen === file.filename}>
                              <DropdownItemCategory
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRename(file.filename);
                                }}
                              >
                                Rename
                              </DropdownItemCategory>
                              <DropdownItemCategory
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChangeCategory(file.filename);
                                }}
                              >
                                Change Category
                              </DropdownItemCategory>
                              <DropdownItemCategory
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(file.filename);
                                }}
                              >
                                Download
                              </DropdownItemCategory>
                              <DropdownItemCategory
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(file.filename);
                                }}
                              >
                                Delete
                              </DropdownItemCategory>
                            </DropdownMenuCategory>
                          </div>
                        </FileOptionsContainer>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <Modal
          visible={modalState.visible}
          title={
            modalState.type === "rename"
              ? "Rename File"
              : modalState.type === "changeCategory"
              ? "Change File Category"
              : "Confirm Delete File"
          }
          value={
            modalState.type === "rename" || modalState.type === "changeCategory"
              ? modalState.inputValue
              : ""
          }
          onChange={(value) =>
            setModalState((prev) => ({ ...prev, inputValue: value }))
          }
          onClose={() =>
            setModalState({
              visible: false,
              type: "",
              fileId: null,
              inputValue: "",
            })
          }
          onSubmit={handleModalSubmit}
          showInput={modalState.type !== "delete"}
        />
        
      </div>
    </StyledDisplayFiles>
  );
};

export default DisplayFiles;