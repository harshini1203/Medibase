import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiFillFilePdf, AiFillFileImage} from "react-icons/ai"; 
import { ToastContainer } from "react-toastify";
import Loading from "../HomeComponents/ExtraComponents/Loading";
import NoFilesFound from "../HomeComponents/ExtraComponents/NoFiles";
import "../Styles/styles.css";
import ViewFileButton from "../ViewAllComponents/ViewFile";
import { 
  CenteredContainer, 
  FileListContainer, 
  FileCard, 
  FileIcon, 
  FileDetails, 
  DeleteIcon, 
  ChatHeader, 
  Title, 
  AddFilesButton ,
  TerminateSessionButton
} from "../Styles/SessionFilesStyles";
import { showSuccessToast, showErrorToast } from "../toastConfig";
import HomeButton from "../HomeBtn";

const ActiveFiles = () => {
  const { userId, doctorName } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  


  const fetchFiles = async () => {
    try {
      const encodedDoctorName = encodeURIComponent(doctorName);
      const response = await axios.get(`http://localhost:3001/getSessionFiles/${userId}/${encodedDoctorName}`);
      console.log("Fetched Data:", response.data);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching session files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [userId, doctorName]);


  const handleAddMoreFiles = () => {
    navigate(`/add-files/${userId}/${doctorName}`);
    showSuccessToast("Files added successfully!");
  };


  const handleDeleteFile = async (fileName) => {
    const confirmDelete = window.confirm("Are you sure you wish to delete this file?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:3001/deleteFileFromSession/${userId}/${doctorName}`, {
        data: { fileName },
      });
  
      setFiles((prevFiles) => prevFiles.filter((file) => file.filename !== fileName));
      console.log(`File deleted from session: ${fileName}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      showErrorToast("Failed to delete file. Please try again!");
    }
  };

  const handleTermination = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/terminateSession/${userId}/${doctorName}`);
  
      if (response.data.success) {
        showSuccessToast("Session terminated successfully!");
  
        setTimeout(() => {
          navigate(`/view-chats/${userId}`);
        }, 2000);
      } else {
        showErrorToast("Failed to terminate session. Try again.");
      }
    } catch (error) {
      console.error("Error terminating session:", error);
      showErrorToast("Error terminating session. Please try again.");
    }
  };

  if (loading) return <Loading />;

  return (
    <CenteredContainer>
        <HomeButton path={`/view-chats/${userId}`} />
        <ToastContainer />
        
        {loading ? (
            <p>Loading files...</p>
        ) : (
            <FileListContainer>
                <Title>Active Chat for {doctorName}</Title>
                <AddFilesButton onClick={handleAddMoreFiles}>Add More Files</AddFilesButton>

                {/* Show files if available, otherwise show "No files found" message */}
                {files.length > 0 ? (
                    files.map((file, index) => (
                        <FileCard key={index}>
                            <FileIcon>
                                {file.contentType?.startsWith("image") ? (
                                    <AiFillFileImage color="#4CAF50" />
                                ) : (
                                    <AiFillFilePdf color="#F44336" />
                                )}
                            </FileIcon>
                            <FileDetails>
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
                            </FileDetails>
                            <DeleteIcon onClick={() => handleDeleteFile(file.filename)} />
                        </FileCard>
                    ))
                ) : (
                    // Keep the UI structure intact and only display a "No files found" message
                    <FileCard>
                        <p>No files found for this session.</p>
                    </FileCard>
                )}

                {/* Terminate Session button should always be visible */}
                <TerminateSessionButton onClick={handleTermination}>Terminate Session</TerminateSessionButton>
            </FileListContainer>
        )}
    </CenteredContainer>
);

};

export default ActiveFiles;
