import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../Styles/styles.css";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const LoginBox = styled.div`
  background: white;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 25px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 80%;
  margin: 0 auto 15px auto;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
`;

const ToggleIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  width: 80%;
  background-color: #001C30;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 15px;
`;

const LinksContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const StyledLink = styled(Link)`
  color: #001C30;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      if (response.status === 200) {
        const userId = response.data.userId;
        const username = response.data.username;
        const sessionID = response.data.sessionID;
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", username);
        localStorage.setItem("sessionID", sessionID);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.error || "Something went wrong.";
      setError(errorMessage);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Login</Title>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <ToggleIcon onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </ToggleIcon>
          </InputWrapper>

          <Button type="submit">Login</Button>
        </form>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LinksContainer>
          <StyledLink to="/register">New User? Register</StyledLink>
          <StyledLink to="/forgot-password">Forgot Password?</StyledLink>
        </LinksContainer>
      </LoginBox>
    </Container>
  );
}

export default Login;
