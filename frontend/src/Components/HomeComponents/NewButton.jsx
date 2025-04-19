import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaFolderPlus } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { CgCloseR } from "react-icons/cg";
import "../Styles/styles.css";
import { ToastContainer } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../toastConfig";

import {
  Container,
  NewButton,
  ModalOverlay,
  ModalContent,
  ModalHeading,
  CloseButton,
  FormGroup,
  InputField,
  Dropdown,
  SaveButton,
} from "../Styles/HomeStyles";

const AddNew = ({ userId, onFileUpload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryModal, setNewCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Check if userId is valid
  useEffect(() => {
    if (!userId) {
      alert("User is not logged in. Please log in again.");
      window.location.href = "/login";
    }
  }, [userId]);

  // Fetch categories on modal open
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getCategories2/${userId}`
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showErrorToast("Failed to fetch categories.");
    }
  }, [userId]);

  const openModal = () => {
    setIsModalOpen(true);
    fetchCategories();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetFields();
  };

  const resetFields = () => {
    setFile(null);
    setFileName("");
    setSelectedCategory("");
    setNewCategory("");
    setNewCategoryModal(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      // Restrict file size to 5MB
      showErrorToast("File size must not exceed 5MB.");
      return;
    }
    setFile(selectedFile);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      showErrorToast("Category name cannot be empty!");
      return;
    }
    try {
      await axios.post(`http://localhost:3001/addNewCategory2/${userId}`, {
        newCategory,
      });
      setNewCategoryModal(false);
      fetchCategories();
      showSuccessToast("New category added successfully!");
    } catch (error) {
      console.error("Error adding new category:", error);
      showErrorToast("Failed to add category.");
    }
  };

  const uploadFile = async () => {
    if (!file || !selectedCategory) {
      showErrorToast("Please select a file and a category!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName || file.name);
    formData.append("category", selectedCategory);

    setIsUploading(true);
    try {
      await axios.post(`http://localhost:3001/upload/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showSuccessToast("File uploaded successfully!");
      onFileUpload && onFileUpload();
      closeModal();
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMsg =
        error.response?.data?.error || "Failed to upload file.";
      showErrorToast(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <NewButton onClick={openModal}>
        <FaFolderPlus size={30} /> NEW
      </NewButton>

      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>
              <CgCloseR size={30} />
            </CloseButton>
            <ModalHeading>Add new files:</ModalHeading>
            <form>
              <FormGroup>
                <label htmlFor="fileUpload">Upload File:</label>
                <InputField
                  type="file"
                  id="fileUpload"
                  accept="*/*"
                  onChange={handleFileChange}
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="fileName">Rename File:</label>
                <InputField
                  type="text"
                  id="fileName"
                  placeholder="Enter new name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="category">Select Category:</label>
                <Dropdown
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Dropdown>
              </FormGroup>

              <FormGroup>
                <NewButton
                  type="button"
                  onClick={() => setNewCategoryModal(true)}
                  id="add-new-category"
                >
                  <BiCategory /> Add new category
                </NewButton>
              </FormGroup>

              <SaveButton
                type="button"
                onClick={uploadFile}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </SaveButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {newCategoryModal && (
        <ModalOverlay onClick={() => setNewCategoryModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeading>Add new category</ModalHeading>
            <FormGroup>
              <label htmlFor="newCategory">Category Name:</label>
              <InputField
                type="text"
                id="newCategory"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </FormGroup>
            <SaveButton type="button" onClick={addCategory}>
              Save
            </SaveButton>
            <CloseButton onClick={() => setNewCategoryModal(false)}>
              <CgCloseR />
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AddNew;
