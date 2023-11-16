import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  from, 0% {
    transform: scale(1,1);
  }

  33% {
    transform: scale(1.1,1.1);
  }

  66% {
    transform: scale(0.9,0.9);
  }
`;

export const Button = styled.button<{ color: string }>`
  min-width: 100px;
  height: 50px;
  padding: 0 20px;
  background-color: ${({ color }) => color};
  border: none;
  border-radius: 5px;
  margin: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);

  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.7;
    box-shadow: none;
    cursor: not-allowed;
    border: 2px solid rgba(255, 255, 255, 0.4);
  }
`;

export const StartButton = styled(Button)`
  width: 200px;
  height: 200px;
  margin: auto;
  padding: 20px;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 50%;
  border: 5px solid #2e7d32;

  animation: ${bounce} 5s ease infinite;
`;
