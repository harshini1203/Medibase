import { ViewMoreButton } from "../Styles/HomeStyles";
import { useNavigate } from "react-router-dom";



function ViewMore() {
    const navigate = useNavigate(); // Moved inside the functional component

    const handleClick = () => {
      navigate("/viewAllFiles"); // Navigate to the desired route
    };
  
    return (
      <>
        <ViewMoreButton onClick={handleClick}>View more</ViewMoreButton>
      </>
    );
}

export default ViewMore;
