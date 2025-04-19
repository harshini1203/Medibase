import React , {useState} from "react";
import AddNew from "./HomeComponents/NewButton";
import SelectFilesButton from "./HomeComponents/selectFilesBtn";
import { BodyContainer, ContentWrapper, NewButtonWrapper } from "./Styles/HomeStyles";
import Navbar from "./HomeComponents/navbar";
import HomeFilePreviews from "./HomeComponents/displayFiles";
import "./Styles/styles.css"
import ViewMore from "./HomeComponents/viewMore";

function Home() {
  const userId = localStorage.getItem("userId");
  const [refreshKey, setRefreshKey] = useState(0);
  const handleFileUpload = () => {
    // Increment refreshKey to trigger re-render of HomeFilePreviews
    setRefreshKey((prevKey) => prevKey + 1);
  };
  return (
    <BodyContainer>
      <Navbar />
      <ContentWrapper>
      <NewButtonWrapper>
        <AddNew userId={userId} onFileUpload={handleFileUpload}/>
        <SelectFilesButton />
      </NewButtonWrapper>
      </ContentWrapper>
      <div>
      <ViewMore/>
      <h1 id="recentFiles">Recent files:</h1>
      </div>
      <HomeFilePreviews userId = {userId} refreshKey={refreshKey}/>
    </BodyContainer>
  );
}

export default Home;
