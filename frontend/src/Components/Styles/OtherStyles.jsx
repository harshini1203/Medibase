import styled from "styled-components";

export const HelpContainer = styled.div`
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
`;

export const HelpTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  font-size: 2.2rem;
`;

export const HelpDescription = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-size: 1rem;
`;

export const FAQSection = styled.div`
  margin-top: 30px;
`;

export const FAQTitle = styled.h2`
  text-align: left;
  color: #34495e;
  font-size: 1.8rem;
  margin-bottom: 20px;
  border-bottom: 3px solid #3498db;
  padding-bottom: 8px;
`;

export const FAQItem = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const FAQQuestion = styled.h3`
  margin: 0 0 8px 0;
  color: #2980b9;
  font-size: 1.2rem;
`;

export const FAQAnswer = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
`;

export const SupportLink = styled.a`
  color: #3498db;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const ButtonWrapper = styled.div`
  position: fixed;
  left: 20px;
  top: ${(props) => (props.isViewAllFilesPage ? "20px" : "90px")};
  background: white;
  padding: 5px;
  width: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease; /* Smooth expansion animation */
  background-color: #001c30;
  color: white;
  z-index: 1000;
  &:hover {
    transform: scale(1.1); /* Expand the entire wrapper on hover */
    background-color: white;
  }
`;

export const StyledButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 40px;
  transition: transform 0.2s ease, color 0.3s ease;
   color: white;

  &:hover {
    color: #001c30; /* Change color on hover */
  }
`;
