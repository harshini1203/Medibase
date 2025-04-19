import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { BiCategory } from "react-icons/bi";
import { FaEllipsisV } from "react-icons/fa";
import Loading from "./HomeComponents/ExtraComponents/Loading";
import {
  StyledCategories,
  AddCategoryButton,
  DropdownMenuCategory,
  DropdownItemCategory,
} from "./Styles/ViewAllStyles";
import Modal from "./ViewAllComponents/Modal";
import {
  showSuccessToast,
  showErrorToast
} from "./toastConfig";
import HomeButton from "./HomeBtn";

const AddCategories = () => {
  const userId = localStorage.getItem("userId");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const [modalState, setModalState] = useState({
    visible: false,
    type: "", // "rename" or "delete"
    category: null,
    inputValue: "",
  });
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/getCategoriesFileCount/${userId}`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Hide loading after data is fetched
      }
    };

    fetchCategories();
  }, [userId]);

  // const handleAddCategory = async () => {
  //   if (!newCategory.trim()) {
  //     showErrorToast("Please enter new category!");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`http://localhost:3001/addNewCategory2/${userId}`, {
  //       newCategory,
  //     });
  //     setCategories([
  //       { category: response.data.newCategory, fileCount: 0 },
  //       ...categories,
  //     ]);
  //     setNewCategory("");
  //   } catch (error) {
  //     console.error("Error adding category:", error);
  //   }
  // };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      showErrorToast("Please enter a category name!");
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:3001/addNewCategory2/${userId}`, {
        newCategory,
      });
  
      // Update the categories list
      setCategories([
        { category: response.data.newCategory, fileCount: 0 },
        ...categories,
      ]);
  
      setNewCategory(""); // Clear the input
      showSuccessToast("Category added successfully!"); // Success message
    } catch (error) {
      console.error("Error adding category:", error);
  
      // Check if the error is a duplicate category error
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "Category already exists"
      ) {
        showErrorToast("Category already exists!"); // Show specific error toast
      } else {
        showErrorToast("Failed to add category. Please try again."); // Generic error message
      }
    }
  };
  
  const handleRenameCategory = async (oldCategory, newCategoryName) => {
    try {
      const response = await axios.post(`http://localhost:3001/renameCategory/${userId}`, {
        oldCategory,
        newCategory: newCategoryName,
      });
  
      if (response.status === 200 && response.data.success) {
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.category === oldCategory
              ? { ...cat, category: newCategoryName }
              : cat
          )
        );
  
        showSuccessToast("Category renamed successfully!");
      } else {
        showErrorToast("Failed to rename category. Please try again.");
      }
  
      setModalState({ visible: false, type: "", category: null, inputValue: "" });
    } catch (error) {
      console.error("Error renaming category:", error);
  
      // Check if the error is due to a duplicate category name
      if (
        error.response &&
        error.response.status === 400 && // Ensure the response has a 400 status
        error.response.data.error === "Category already exists"
      ) {
        showErrorToast("Category already exists!"); // Specific error toast
      } else {
        showErrorToast("An error occurred while renaming the category."); // Generic error
      }
    }
  };
  

  const handleDeleteCategory = async (categoryToDelete) => {
    try {
      await axios.post(`http://localhost:3001/deleteCategory/${userId}`, {
        categoryToDelete,
      });

      const response = await axios.get(`http://localhost:3001/getCategoriesFileCount/${userId}`);
      setCategories(response.data.categories || []);

      showSuccessToast("Category deleted successfully!");
      setModalState({ visible: false, type: "", category: null, inputValue: "" });
    } catch (error) {
      console.error("Error deleting category:", error);
      showErrorToast("Failed to delete category.");
    }
  };

  const handleModalClose = () => {
    setModalState({ visible: false, type: "", category: null, inputValue: "" });
  };

  const handleModalSubmit = () => {
    if (modalState.type === "rename") {
      handleRenameCategory(modalState.category, modalState.inputValue);
    } else if (modalState.type === "delete") {
      handleDeleteCategory(modalState.category);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    setDropdownOpen(index);
  };

  const handleMouseLeave = (index) => {
    if (hoveredDropdown === index) {
      setHoveredDropdown(null);
      setDropdownOpen(null);
    }
  };

  const handleRename = (category) => {
    setModalState({
      visible: true,
      type: "rename",
      category,
      inputValue: category,
    });
    setDropdownOpen(null);
  };

  const handleDelete = (category) => {
    setModalState({
      visible: true,
      type: "delete",
      category,
      inputValue: "",
    });
    setDropdownOpen(null);
  };

  if (loading) {
    return <Loading />; // Render the Loading component while loading
  }

  return (
    <>
    <HomeButton/>
    <StyledCategories>
      <ToastContainer />
      <h1>Categories</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <div className="add-button">
          <AddCategoryButton onClick={handleAddCategory}>
            Add Category
          </AddCategoryButton>
        </div>
      </div>
      <ul className="categories-list">
        {categories.map((category, index) => (
          <li
            key={index}
            className="category-item"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => {
              setHoveredIndex(null);
              setDropdownOpen(null);
            }}
          >
            <BiCategory size={20} />
            <span className="category-name">{category.category}</span>
            <span className="file-count">({category.fileCount} files)</span>
            <div className="file-options-container">
              <div
                className="file-options"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <FaEllipsisV size={20} />
                {dropdownOpen === index && (
                  <div className="dropdown-wrapper">
                    <DropdownMenuCategory isVisible={dropdownOpen === index}>
                      <DropdownItemCategory
                        onClick={() => handleRename(category.category)}
                      >
                        Rename
                      </DropdownItemCategory>
                      <DropdownItemCategory
                        onClick={() => handleDelete(category.category)}
                      >
                        Delete
                      </DropdownItemCategory>
                    </DropdownMenuCategory>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        visible={modalState.visible}
        title={
          modalState.type === "rename"
            ? "Rename Category"
            : "Confirm Delete Category"
        }
        value={modalState.type === "rename" ? modalState.inputValue : ""}
        onChange={(value) =>
          setModalState((prev) => ({ ...prev, inputValue: value }))
        }
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        showInput={modalState.type !== "delete"}
      />
    </StyledCategories>
    </>
  );
};

export default AddCategories;
