import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios"; 
import { showErrorToast, showSuccessToast } from "../toastConfig"; 
import { ToastContainer } from "react-toastify";
import { AiFillFilePdf, AiFillFileImage } from "react-icons/ai";
import { 
    CenteredContainer, 
    FileListContainer, 
    FileCard, 
    FileIcon, 
    FileDetails, 
    Title, 
    TitleSmall
} from "../Styles/SessionFilesStyles";
import ViewFileButton from "../ViewAllComponents/ViewFile";
import Loading from "../HomeComponents/ExtraComponents/Loading";
import NoFilesFound from "../HomeComponents/ExtraComponents/NoFiles";

const ViewFilesByDoctor = () => {
    const { sessionId } = useParams();
    const location = useLocation();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [errorMsg,setErrorMsg]=useState("");
    const [loadingSessionValidation, setLoadingSessionValidation] = useState(true); 
    const [loadingFiles, setLoadingFiles] = useState(true); 
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (!token) {
            const msg = "Access Denied: No valid token provided.";
            setErrorMsg(msg);
            showErrorToast(msg);
            setLoadingSessionValidation(false);
            return;
        }

        let sessionOwnerId = localStorage.getItem("sessionOwnerId");

        axios
            .get(`http://localhost:3001/validate-session/${sessionId}?token=${token}`, {
                headers: { "x-session-owner": sessionOwnerId || "" },
            })
            .then((response) => {
                if (response.data.message === "Session Valid") {
                    setFiles(response.data.files);
                    if (response.data.sessionOwnerId) {
                        localStorage.setItem("sessionOwnerId", response.data.sessionOwnerId);
                    }
                } else {
                    setErrorMsg(response.data.message);
                    showErrorToast(response.data.message);
                }
            })
            .catch((error) => {
                let msg = "Access denied: Server error."; // Default error message
                
                if (error.response && error.response.data && error.response.data.message) {
                    msg = error.response.data.message; // ✅ Corrected reference
                }
                setErrorMsg(msg);
                showErrorToast(msg);
            }).finally(() => {  
                setLoadingSessionValidation(false);
            });
    }, [sessionId, location]);

    //getting userId and doctorName to fetch files
    const [userId, setUserId] = useState(null);
    const [doctorName, setDoctorName] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3001/getSessionDetails/${sessionId}`)
            .then(response => {
                setUserId(response.data.userId);
                setDoctorName(response.data.doctorName);
            })
            .catch(error => {
                console.error("Error fetching session details:", error);
            });
    }, [sessionId]);




    //fetch files to display
    const fetchFiles = async () => {
        try {
              setLoadingFiles(true);
          const encodedDoctorName = encodeURIComponent(doctorName);
          const response = await axios.get(`http://localhost:3001/getSessionFiles/${userId}/${encodedDoctorName}`);
          console.log("Fetched Data:", response.data);
          setFiles(response.data);
        } catch (error) {
          console.error("Error fetching session files:", error);
        } finally {
            setLoadingFiles(false); // ✅ Stop loading after files are fetched
        }
      };
    
      useEffect(() => {
        if (userId && doctorName) {
            fetchFiles(); // Initial fetch
    
            const intervalId = setInterval(() => {
                fetchFiles();
            }, 300000); // 3 seconds
    
            return () => clearInterval(intervalId); // Cleanup on unmount
        }
    }, [userId, doctorName]);
    
    
    //start of components

    if (loadingSessionValidation) return <Loading />;
    if (errorMsg) return <NoFilesFound message={errorMsg} />; 
    if (loadingFiles) return <Loading />;
    if (files.length === 0 & !errorMsg) return <NoFilesFound />;
    return (
        <CenteredContainer>
            <ToastContainer />
                {/* Check if all files are terminated */}
                {files.length === 0 || files.every(file => !file.uploadDate) ? (
                    <NoFilesFound message="Session terminated by user!" />
                ) : (
                    <FileListContainer>
                        <Title>Welcome {doctorName}!</Title>
                        <TitleSmall>Click on the files to view them</TitleSmall>
                        {files.map((file, index) => (
                            <FileCard key={index}>
                                <FileIcon>
                                    {file.contentType?.startsWith("image") ? (
                                        <AiFillFileImage color="#4CAF50" />
                                    ) : (
                                        <AiFillFilePdf color="#F44336" />
                                    )}
                                </FileIcon>
                                <FileDetails>
                                    <ViewFileButton userId={userId} fileName={file.filename} setLoading={setLoadingFiles} allowDownload={false}/>
                                    <div className="file-info">
                                        {`Uploaded • ${new Date(file.uploadDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}`}
                                    </div>
                                </FileDetails>
                            </FileCard>
                        ))}
                    </FileListContainer>
                )}
        </CenteredContainer>
    );
    
    
};

export default ViewFilesByDoctor;
