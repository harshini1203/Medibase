import React, { useState } from "react";
import ReactDOM from "react-dom";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from "axios";
import styled from "styled-components";
import { CloseButton } from "../Styles/HomeStyles";
import "../Styles/styles.css";
import DownloadButton from "../HomeComponents/downloadButton";
import { CgCloseR } from "react-icons/cg";

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 80%;
  height: 80%;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const StyledDocViewer = styled(DocViewer)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #ccc;
  button[aria-label="Download"] {
  display: none !important;
}

`;
const FileName = styled.span`
  cursor: pointer;
  color: inherit; /* Default text color */
  &:hover {
    color: #007BFF; /* Hover color */
  }
`;

let modalHeader;
let downloadName;


function ViewFileButton({ userId, fileName ,setLoading, allowDownload=true}) {
    const [fileData, setFileData] = useState(null);

    const handleFetchFile = async () => {
      try {
    
        const response = await axios.get(
          `http://localhost:3001/file/${userId}/${fileName}`,
          {
            responseType: "arraybuffer",
          }
        );
        setLoading(false);
        const fileBlob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
  
        const contentType = response.headers["content-type"];
        const fileUrl = URL.createObjectURL(fileBlob);
  
        let fileExtension;
        if (contentType.startsWith("text")) {
          fileExtension = "txt";
        } else {
          fileExtension = contentType.split(";")[0].split("/")[1];
        }
  
        modalHeader = "Viewing: " + fileName + "." + fileExtension;
        downloadName = fileName + "." + fileExtension;
  
        setFileData([{ uri: fileUrl, fileName: "..." }]);
      } catch (error) {
        console.error("Error fetching file:", error);
        alert("Failed to fetch the file.");
      }
    };
  
    const handleClose = () => {
      if (fileData) {
        fileData.forEach((doc) => URL.revokeObjectURL(doc.uri));
      }
      setFileData(null);
    };
  
    const handleOverlayClick = (event) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    };
  
    const viewerContent = fileData && (
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalContent onClick={(event) => event.stopPropagation()}>
          <CloseButton onClick={handleClose}>
            <CgCloseR size="35px" />
          </CloseButton>
          {allowDownload && (
          <DownloadButton
            fileName={fileName}
            userId={userId}
            downloadName={downloadName}
          />
        )}
          <ModalHeader id="modalHeading">{modalHeader}</ModalHeader>
          <StyledDocViewer
            documents={fileData}
            pluginRenderers={DocViewerRenderers}
          />
        </ModalContent>
      </ModalOverlay>
    );
  
    return (
      <>
        <FileName onClick={handleFetchFile}>{fileName}</FileName>
        
        {ReactDOM.createPortal(
          viewerContent,
          document.getElementById("doc-viewer-root")
        )}
      </>
    );
  }
  
  export default ViewFileButton;
  