import React, { useState } from "react";
import styled from "styled-components";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { showSuccessToast } from "../toastConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  background: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  height: 45px;
  padding: 0 40px 0 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
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
  padding: 12px;
  background-color: #001C30;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorText = styled.p`
  color: red;
  margin-bottom: 15px;
  text-align: center;
`;

const StyledSignInLink = styled.p`
  margin-top: 20px;
  color: #001C30;
  text-align: center;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
    color: #0056b3;
  }
`;
function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { username, email, confirmEmail, password, confirmPassword } = formData;
  
    if (email !== confirmEmail) return setError("Emails do not match!");
    if (!validateEmail(email)) return setError("Invalid email format.");
    if (password !== confirmPassword) return setError("Passwords do not match!");
    if (!validatePassword(password)) {
      return setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
    }
  
    try {
      const response = await axios.post("http://localhost:3001/register", {
        username,
        password,
        email,
      });
  
      if (response.status === 201) {
        showSuccessToast("User created successfully!");
        setError(""); // clear errors
        setTimeout(() => {
            navigate("/");
          }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Something went wrong.";
      setError(errorMessage);
    }
  };
  

  return (
    <Container>
    <ToastContainer></ToastContainer>
      <Title>Create an Account</Title>
      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            type="email"
            name="confirmEmail"
            placeholder="Re-enter Email ID"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <ToggleIcon onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </ToggleIcon>
        </InputWrapper>

        <InputWrapper>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <ToggleIcon onClick={() => setShowConfirmPassword((prev) => !prev)}>
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </ToggleIcon>
        </InputWrapper>

        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit">Register</Button>
        <StyledSignInLink onClick={()=>navigate("/")}>Sign in</StyledSignInLink>
      </Form>
    </Container>
  );
}

export default RegisterPage;


