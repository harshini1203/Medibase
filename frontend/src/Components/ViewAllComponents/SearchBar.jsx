import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { SearchBox, Row, Input, Button, ResultBox, NoResultsMessage } from "../Styles/ViewAllStyles";
import axios from "axios";
import HomeButton from "../HomeBtn";

const SearchBar = ({ onSearch }) => {
  const userId = localStorage.getItem("userId");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [noResults, setNoResults] = useState(false); // Tracks if no results were found
  const resultBoxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchFileNames = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/getFiles/${userId}`);
        setAllFiles(response.data.files);
      } catch (error) {
        console.error("Error fetching filenames:", error);
      }
    };

    if (userId) fetchFileNames();
  }, [userId]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setNoResults(false); // Reset no results state

    // Show suggestions based on the input value
    if (value) {
      const filteredSuggestions = allFiles.filter((fileName) =>
        fileName.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions when the input is empty
    }
  };

  const handleSuggestionClick = (fileName) => {
    setQuery(fileName);
    setSuggestions([]);
    setNoResults(false); // Reset no results state
    inputRef.current.focus(); // Keep the cursor active in the input field
  };

  const handleSearch = () => {
    if (query) {
      const filteredSuggestions = allFiles.filter((fileName) =>
        fileName.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredSuggestions.length === 0) {
        setNoResults(true); // Set no results state if no matches
      } else {
        setNoResults(false); // Reset no results state
      }

      onSearch(query); // Pass the search query to the parent
      setSuggestions([]); // Clear suggestions
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setNoResults(false); // Reset no results state
    onSearch(""); // Trigger parent reset (display all files)
    inputRef.current.focus(); // Keep the cursor active in the input field
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search on Enter key
    }
  };

  const handleClickOutside = (event) => {
    if (
      resultBoxRef.current &&
      !resultBoxRef.current.contains(event.target) &&
      event.target.tagName !== "INPUT"
    ) {
      setSuggestions([]); // Clear suggestions when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SearchBox>
      <Row>
        <Input
          type="text"
          placeholder="Search for files"
          value={query}
          onChange={handleInputChange} // Update suggestions dynamically
          onKeyDown={handleKeyDown} // Listen for Enter key
          ref={inputRef} // Attach the ref to the input field
          autoComplete="off"
        />
        <Button onClick={query ? handleClearSearch : handleSearch}>
          {query ? <FaTimes /> : <FaSearch />}
        </Button>
      </Row>
      {suggestions.length > 0 && (
        <ResultBox ref={resultBoxRef}>
          <ul>
            {suggestions.map((fileName, index) => (
              <li key={index} onClick={() => handleSuggestionClick(fileName)}>
                {fileName}
              </li>
            ))}
          </ul>
        </ResultBox>
      )}
      {noResults && <NoResultsMessage>No files found</NoResultsMessage>}
    </SearchBox>
  );
};

export default SearchBar;
