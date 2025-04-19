import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../HomeComponents/ExtraComponents/Loading";
import NoFilesFound from "../HomeComponents/ExtraComponents/NoFiles";
import { 
    Container, 
    ChatList, 
    ChatCard, 
    Title, 
  } from "../Styles/SessionFilesStyles";
import HomeButton from "../HomeBtn";


const ActiveChats = () => {
  const { userId } = useParams(); // Get userId from route
  const navigate = useNavigate(); // ✅ Use navigate for programmatic navigation
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/getActiveSessions/${userId}`);
        setSessions(response.data.sessions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchActiveSessions(); // Initial fetch
  
      const intervalId = setInterval(() => {
        fetchActiveSessions();
      }, 3000); // Refresh every 3 seconds
  
      return () => clearInterval(intervalId); // Clean up on unmount
    }
  }, [userId]);

  // ✅ Navigate to the ActiveFiles page when clicking a doctor
  const handleChatClick = (doctorName) => {
    navigate(`/active-chat/${userId}/${encodeURIComponent(doctorName)}`);
  };

  if (loading) return <Loading />;
  // if (files.length === 0) return <NoFilesFound />;

  return (
    <Container>
      <HomeButton />      
      {loading ? (
        <p>Loading active chats...</p>
      ) : sessions.length > 0 ? (
        <ChatList>
        <Title>Active Chat Sessions</Title>
          {sessions.map((session, index) => (
            <ChatCard key={index} onClick={() => handleChatClick(session.doctorName)}>
              {session.doctorName}
            </ChatCard>
          ))}
        </ChatList>
      ) : (
        <NoFilesFound message="No active chats found!" />
      )}

    </Container>
  );
};

export default ActiveChats;
