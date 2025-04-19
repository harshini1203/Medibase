import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for the animation
const spin = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Styled-components
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e8f0ff;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: #001C30;
  border-radius: 50%;
  animation: ${spin} 0.6s infinite ease-in-out;
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// React Component
const Loading = () => {
  return (
    <LoadingWrapper>
      <DotsContainer>
        <Dot />
        <Dot />
        <Dot />
      </DotsContainer>
    </LoadingWrapper>
  );
};

export default Loading;
