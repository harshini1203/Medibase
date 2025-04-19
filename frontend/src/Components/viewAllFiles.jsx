import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "./ViewAllComponents/SearchBar";
import DisplayFiles from "./ViewAllComponents/DisplayFiles";
import HomeButton from "./HomeBtn";
import SelectSendButtons from "./ViewAllComponents/SelectSendButtons";
import DoctorDetailsModal from "./ViewAllComponents/DoctorDetailsModal";
import { showErrorToast, showSuccessToast } from "./toastConfig";
import axios from "axios";
import {
  HeaderContainer,
  CenteredSearchBar,
  PageContainer,
  ContentContainer,
} from "./Styles/ViewAllStyles";


const ViewAllFiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // New state for storing _id values
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (searchParams.get("select") === "true") {
      setSelectionMode(true);
    }
  }, [searchParams]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchTriggered(true);
  };

  const handleSendClick = () => {
    if (selectedFiles.length === 0) {
      showErrorToast("No files selected to send.");
      return;
    }
    setModalVisible(true); // Open modal
  };


  const handleModalSubmit = async (doctorName, doctorEmail) => {
    try {
        const response = await axios.post(
            `http://localhost:3001/sendFiles/${userId}`,
            {
                selectedFiles: selectedIds,
                doctorName,
                doctorEmail,
            }
        );

        if (response.status === 200) {
                showSuccessToast("Files sent successfully, go to 'Active Chats' to view your live sessions!");
                setSelectionMode(false);
                setSelectedFiles([]);
                setSelectedIds([]);
                setModalVisible(false);
            
        }
        else {
          showErrorToast("Failed to send files. Please try again.");
      }
    } catch (error) {
        console.error("Error sending files:", error);
        showErrorToast("An error occurred while sending files.");
    }
};

  return (
    <PageContainer>
      <HeaderContainer>
        <HomeButton isViewAllFilesPage={true}/>
        <CenteredSearchBar>
          <SearchBar onSearch={handleSearch} />
        </CenteredSearchBar>
        <SelectSendButtons
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          userId={userId}
          showSendButton={false}
          showCancelButton={true}
        />
      </HeaderContainer>

      <ContentContainer>
        <DisplayFiles
          searchQuery={searchQuery}
          searchTriggered={searchTriggered}
          selectionMode={selectionMode}
          setSelectedFiles={setSelectedFiles}
          selectedFiles={selectedFiles}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </ContentContainer>

      {selectionMode && selectedFiles.length > 0 && (
        <SelectSendButtons
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          userId={userId}
          showSendButton={true}
          showCancelButton={false}
          handleSendClick={handleSendClick} // Opens modal
        />
      )}

      {/* Doctor Details Modal */}
      <DoctorDetailsModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedFiles([]); // Deselect files on cancel
          setSelectedIds([]);
        }}
        onSubmit={handleModalSubmit}
        selectedFiles={selectedIds} // Pass selected files
      />
    </PageContainer>
  );
};

export default ViewAllFiles;
