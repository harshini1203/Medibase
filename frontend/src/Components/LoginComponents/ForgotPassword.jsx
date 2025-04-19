import React, { useState } from "react";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../toastConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  width: 80%;
  margin: 0 auto 15px auto;
`;

const Input = styled.input`
  width: 100%;
  height: 45px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
`;

const Button = styled.button`
  margin: 10px auto 0 auto;
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

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !userId) {
      return setError("Email and User ID are required.");
    }

    try {
      await axios.post(
        `http://localhost:3001/send-verification-forgot-password/${userId}`,
        { email }
      );
      showSuccessToast("Verification email sent!");
      setError("");
      setEmailSent(true); // ✅ show "Resend Email"
    } catch (err) {
      showErrorToast(err.response?.data?.error || "Something went wrong.");
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Title>Forgot Password</Title>
      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="email"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputWrapper>
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit">
          {emailSent ? "Resend Reset Link" : "Send Reset Link"}
        </Button>
        <StyledSignInLink onClick={() => navigate("/")}>
          Back to Sign In
        </StyledSignInLink>
      </Form>
    </Container>
  );
}

export default ForgotPassword;
