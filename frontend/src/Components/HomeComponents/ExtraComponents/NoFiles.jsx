import { NoFilesContainer } from "../../Styles/HomeStyles";
import { LiaSadTear } from "react-icons/lia";
function NoFilesFound({message="No Files Found"}) {
    return <NoFilesContainer><LiaSadTear size="50px"/>{message}</NoFilesContainer>;
  }
  
  export default NoFilesFound;