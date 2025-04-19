// import React, { useState } from "react";
// import ReactDOM from "react-dom";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
// import axios from "axios";
// import styled from "styled-components";
// import { ClickToViewButton, CloseButton } from "../Styles/HomeStyles";
// import "../Styles/styles.css";
// import DownloadButton from "./downloadButton";
// import { CgCloseR } from "react-icons/cg";

// // Styled Components
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// `;

// const ModalContent = styled.div`
//   width: 80%;
//   height: 80%;
//   background-color: #fff;
//   border-radius: 8px;
//   padding: 20px;
//   position: relative;
//   overflow-y: auto;
// `;

// const ModalHeader = styled.div`
//   font-size: 18px;
//   font-weight: bold;
//   color: #333;
//   margin-bottom: 20px;
//   text-align: center;
// `;

// const StyledDocViewer = styled(DocViewer)`
//   width: 100%;
//   height: 100%;
//   border-radius: 10px;
//   border: 1px solid #ccc;
//   button[aria-label="Download"] {
//   display: none !important;
// }
//   }
// `;

// let modalHeader;
// let downloadName;
// function ExpandButton({ userId, fileName }) {
//   const [fileData, setFileData] = useState(null);
//   const handleFetchFile = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3001/file/${userId}/${fileName}`,
//         {
//           responseType: "arraybuffer",
//         }
//       );

//       const fileBlob = new Blob([response.data], {
//         type: response.headers["content-type"],
//       });

//       const contentType = response.headers["content-type"];
//       const fileUrl = URL.createObjectURL(fileBlob);

//       let fileExtension;
//       // Check if Content-Type starts with "text"
//       if (contentType.startsWith("text")) {
//         fileExtension = "txt"; // Explicitly set to .txt
//       } else {
//         // Extract the file extension for other types
//         fileExtension = contentType.split(";")[0].split("/")[1];
//       }
//       modalHeader = "Viewing: " + fileName + "." + fileExtension;
//       downloadName = fileName + "." + fileExtension;

//       setFileData([{ uri: fileUrl, fileName: "..." }]); // Pass the file URL to the viewer
//     } catch (error) {
//       console.error("Error fetching file:", error);
//       alert("Failed to fetch the file.");
//     }
//   };

//   const handleClose = () => {
//     if (fileData) {
//       fileData.forEach((doc) => URL.revokeObjectURL(doc.uri));
//     }
//     setFileData(null);
//   };

//   const handleOverlayClick = (event) => {
//     // Check if the click is directly on the overlay
//     if (event.target === event.currentTarget) {
//       handleClose();
//     }
//   };

//   const viewerContent = fileData && (
//     <ModalOverlay onClick={handleOverlayClick}>
//       <ModalContent onClick={(event) => event.stopPropagation()}>
//         <CloseButton onClick={handleClose}><CgCloseR size="35px" /></CloseButton>
//         <DownloadButton fileName={fileName} userId={userId}  downloadName={downloadName}/>
//         <ModalHeader id="modalHeading">{modalHeader}</ModalHeader>
//         <StyledDocViewer
//           documents={fileData}
//           pluginRenderers={DocViewerRenderers}
//         />
//       </ModalContent>
//     </ModalOverlay>
//   );

//   return (
//     <>
//       <ClickToViewButton onClick={handleFetchFile}>
//         Click to View
//       </ClickToViewButton>
//       {ReactDOM.createPortal(
//         viewerContent,
//         document.getElementById("doc-viewer-root")
//       )}
//     </>
//   );
// }

// export default ExpandButton;

import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from "axios";
import styled from "styled-components";
import { ClickToViewButton, CloseButton } from "../Styles/HomeStyles";
import "../Styles/styles.css";
import DownloadButton from "./downloadButton";
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

function ExpandButton({ userId, fileName }) {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchFile = useCallback(async () => {
    if (fileData) return; // Avoid re-fetching if data is already loaded

    setLoading(true); // Show loading indicator
    try {
      const response = await axios.get(
        `http://localhost:3001/file/${userId}/${fileName}`,
        {
          responseType: "arraybuffer",
        }
      );

      const fileBlob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const contentType = response.headers["content-type"];
      const fileUrl = URL.createObjectURL(fileBlob);

      const fileExtension = contentType.startsWith("text")
        ? "txt"
        : contentType.split(";")[0].split("/")[1];

      setFileData([
        {
          uri: fileUrl,
          fileName: `${fileName}.${fileExtension}`,
        },
      ]);
    } catch (error) {
      console.error("Error fetching file:", error);
      alert("Failed to fetch the file.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  }, [fileData, fileName, userId]);

  const handleClose = useCallback(() => {
    if (fileData) {
      fileData.forEach((doc) => URL.revokeObjectURL(doc.uri));
    }
    setFileData(null);
  }, [fileData]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const viewerContent = fileData && (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={handleClose}>
          <CgCloseR size="35px" />
        </CloseButton>
        <DownloadButton fileName={fileName} userId={userId} />
        <ModalHeader>Viewing: {fileData[0].fileName}</ModalHeader>
        <StyledDocViewer
          documents={fileData}
          pluginRenderers={DocViewerRenderers}
        />
      </ModalContent>
    </ModalOverlay>
  );

  return (
    <>
      <ClickToViewButton onClick={handleFetchFile} disabled={loading}>
        {loading ? "Loading..." : "Click to View"}
      </ClickToViewButton>
      {ReactDOM.createPortal(
        viewerContent,
        document.getElementById("doc-viewer-root")
      )}
    </>
  );
}

export default ExpandButton;

