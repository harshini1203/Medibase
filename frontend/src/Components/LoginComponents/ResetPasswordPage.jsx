import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../toastConfig";
import { FiEye, FiEyeOff } from "react-icons/fi";

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

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPasswordPage() {
  const query = useQuery();
  const token = query.get("token");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/verify-email-password-reset?token=${token}`
        );
        setEmail(res.data.email);
        setLoading(false);
      } catch (err) {
        showErrorToast("Invalid or expired reset link");
        //navigate("/forgot-password");
      }
    };

    if (token) verifyToken();
  }, [token, navigate]);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) return setError("Missing required fields");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!validatePassword(password)) {
      return setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
    }

    try {
      await axios.post("http://localhost:3001/reset-password-backend", {
        email,
        newPassword: password,
      });

      showSuccessToast("Password reset successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      showErrorToast(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Title>Reset Your Password</Title>
      {loading ? (
        <p style={{ textAlign: "center" }}>Verifying link...</p>
      ) : (
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ToggleIcon onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </ToggleIcon>
          </InputWrapper>

          <InputWrapper>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <ToggleIcon onClick={() => setShowConfirmPassword((prev) => !prev)}>
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </ToggleIcon>
          </InputWrapper>

          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={loading}>
            Reset Password
          </Button>
          <StyledSignInLink onClick={() => navigate("/")}>
            Back to Sign In
          </StyledSignInLink>
        </Form>
      )}
    </Container>
  );
}

export default ResetPasswordPage;
