import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../Styles/styles.css";
import {
  GridContainer,
  FileBlock,
  FileName,
  UploadDate,
} from "../Styles/HomeStyles";
import ExpandButton from "./expandButton";
import Loading from "./ExtraComponents/Loading";
import NoFilesFound from "./ExtraComponents/NoFiles";

function HomeFilePreviews({ userId, refreshKey }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        if (!userId) {
          setError("User ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/files2/recent/${userId}`
        );
        setFiles(response.data);
        setError(null); // Clear previous errors, if any
      } catch (err) {
        console.error("Error fetching files:", err);
        if (files.length === 0) return <NoFilesFound />;
      } finally {
        setLoading(false);
      }
    }

    fetchFiles();
  }, [userId, refreshKey]);

  // Memoized function to render file previews
  const renderPreview = (file) => {
    const { preview, filename } = file;

    if (preview.startsWith("data:image/")) {
      // Image Preview
      return (
        <img
          src={preview}
          alt={filename}
          style={{ width: "100%", maxHeight: "140px", objectFit: "cover" }}
        />
      );
    } else if (preview.startsWith("data:application/pdf")) {
      // PDF Preview
      return (
        <iframe
          src={preview}
          title={filename}
          style={{ width: "100%", height: "140px", border: "none" }}
          scrolling="no"
        ></iframe>
      );
    } else if (preview.startsWith("data:text/")) {
      // Plain Text Preview
      return (
        <textarea
          value={atob(preview.split(",")[1])} // Decode Base64 back to text
          readOnly
          style={{
            width: "100%",
            height: "140px",
            resize: "none",
            border: "1px solid #ccc",
          }}
        ></textarea>
      );
    } else {
      // Unsupported File Type
      return <p>Preview not available for this file type.</p>;
    }
  };

  // Memoized rendering of files
  const fileList = useMemo(
    () =>
      files.map((file) => (
        <FileBlock key={file.filename}>
          <FileName>{file.filename}</FileName>
          {renderPreview(file)}
          <UploadDate>
            Uploaded:{" "}
            {new Date(file.uploadDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </UploadDate>
          <ExpandButton fileName={file.filename} userId={userId} />
        </FileBlock>
      )),
    [files, userId]
  );

  // Conditional Rendering
  if (loading) return <Loading />;
  if (error) return <div className="error-message">{error}</div>;
  if (files.length === 0) return <NoFilesFound />;

  return (
    <div id="displayFilesDiv">
      <GridContainer>{fileList}</GridContainer>
    </div>
  );
}

export default HomeFilePreviews;
