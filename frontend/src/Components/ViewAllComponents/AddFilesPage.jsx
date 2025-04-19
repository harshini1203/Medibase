import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Loading from "../HomeComponents/ExtraComponents/Loading";
import ViewFileButton from "./ViewFile";
import { AiFillFilePdf, AiFillFileImage } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { StyledDisplayFiles, CenteredSearchBar } from "../Styles/ViewAllStyles";
import {AddMoreContainer,CenteredSearchBarAddMoreFiles} from "../Styles/SessionFilesStyles";
import "../Styles/styles.css";
import SearchBar from "./SearchBar"; // ✅ Import SearchBar
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast, showWarningToast } from "../toastConfig";
import FileCheckbox from "./FileCheckbox";
import NoFilesFound from "../HomeComponents/ExtraComponents/NoFiles";
import { Button, ButtonContainer } from "../Styles/SessionFilesStyles";

const DisplayFiles = ({ selectionMode = true }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { userId, doctorName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [noFiles, setNoFiles] = useState(true);
  const [searchParams] = useSearchParams();

  // ✅ Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      setNoFiles(true);
    } else {
      setNoFiles(false);
    }
  }, [categories]);

  useEffect(() => {
    const fetchFilesAndCategories = async () => {
      try {
        if (!userId) {
          console.error("User ID is missing.");
          return;
        }
        const encodedDoctorName = encodeURIComponent(doctorName);
        const sessionFilesResponse = await axios.get(
          `http://localhost:3001/getSessionFiles/${userId}/${encodedDoctorName}`
        );
        const sessionFiles = sessionFilesResponse.data.map((file) => file.filename);

        const categoriesResponse = await axios.get(`http://localhost:3001/categories/${userId}`);
        const allCategories = categoriesResponse.data;

        const filteredCategories = allCategories
          .map((category) => ({
            ...category,
            files: category.files.filter((file) => !sessionFiles.includes(file.filename)),
          }))
          .filter((category) => category.files.length > 0);

        setCategories(filteredCategories);
        setFilteredCategories(filteredCategories);

        const initialExpandedState = filteredCategories.reduce((acc, category) => {
          acc[category.categoryName] = true;
          return acc;
        }, {});
        setExpandedCategories(initialExpandedState);
      } catch (error) {
        console.error("Error fetching files or categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilesAndCategories();
  }, [userId, doctorName]);

  useEffect(() => {
    if (selectionMode) {
      const expandedState = categories.reduce((acc, category) => {
        acc[category.categoryName] = true;
        return acc;
      }, {});
      setExpandedCategories(expandedState);
    }
  }, [selectionMode, categories]);

  useEffect(() => {
    if (searchParams.get("select") === "true") {
      setSelectionMode(true);
    }
  }, [searchParams]);

  // ✅ Handle Search Function
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchTriggered(true);
  };

  // ✅ Filter Files Based on Search
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

  const handleAddFiles = async () => {
    try {
      if (selectedFiles.length === 0) {
        showWarningToast("Please select at least one file.");
        return;
      }

      await axios.post(`http://localhost:3001/addFilesToSession/${userId}/${doctorName}`, {
        selectedFiles,
      });
      showSuccessToast("Files added successfully!");
      setTimeout(() => {
        navigate(-1); // Navigate back after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Error adding files to session:", error);
      showErrorToast("Failed to add files. Please try again.");
    }
  };

  return (
    <>
    <AddMoreContainer>
      <ButtonContainer>
        <Button onClick={handleAddFiles}>Add Files</Button>
        <Button onClick={() => navigate(-1)}>{noFiles ? "Go Back" : "Cancel"}</Button>
      </ButtonContainer>
        <CenteredSearchBarAddMoreFiles>
            <SearchBar onSearch={handleSearch} />
        </CenteredSearchBarAddMoreFiles>
        </AddMoreContainer>
    <StyledDisplayFiles>
    
      <ToastContainer />

      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <NoFilesFound />
      ) : (
        filteredCategories.map((category) => (
          <div key={category.categoryName} className="category-box">
            <h2
              className="category-header"
              onClick={() =>
                setExpandedCategories((prev) => ({
                  ...prev,
                  [category.categoryName]: !prev[category.categoryName],
                }))
              }
            >
              {category.categoryName}
              <FaChevronDown
                className={`toggle-icon ${expandedCategories[category.categoryName] ? "rotated" : ""}`}
              />
            </h2>
            {expandedCategories[category.categoryName] && (
              <div className="file-view-container">
                {category.files.map((file, index) => (
                  <div key={index} className="file-view">
                    <FileCheckbox
                      fileName={file.filename}
                      isSelected={selectedFiles?.includes(file.filename)}
                      onFileCheck={() =>
                        setSelectedFiles((prev) =>
                          prev.includes(file.filename)
                            ? prev.filter((f) => f !== file.filename)
                            : [...prev, file.filename]
                        )
                      }
                    />
                    <div className="file-icon">
                      {file.contentType.startsWith("image") ? (
                        <AiFillFileImage size={24} color="#4CAF50" />
                      ) : (
                        <AiFillFilePdf size={24} color="#F44336" />
                      )}
                    </div>
                    <div className="file-details">
                      <ViewFileButton userId={userId} fileName={file.filename} setLoading={setLoading} />
                      <div className="file-info">
                        {file.uploadDate
                          ? `Uploaded • ${new Date(file.uploadDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </StyledDisplayFiles>
    </>
  );
};

export default DisplayFiles;
