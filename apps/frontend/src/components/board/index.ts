import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const Board = styled.div`
  all: unset;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: #00695c;
`;

export const ControlsLayout = styled.div`
  width: 100%;

  position: absolute;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: flex-start;
`;

export const Score = styled.h1`
  color: #fff;
  margin-right: auto;
  margin-left: 10px;

  & > b {
    color: #ffeb3b;
  }
`;

export const PlayerHand = styled.div`
  position: absolute;
  bottom: 250px;
  left: 50%;
  transform: translateX(-50%);
`;

export const DealerHand = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
`;

const gameResultAnimation = keyframes`
  from, 0% {
    transform: translate(-50%, -50%) scale(1,1);
  }

  50% {
    transform: translate(-50%, -50%) scale(2,2);
  }

  to {
    transform: translate(-50%, -50%) scale(1,1);
  }
`;

export const GameResult = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: ${gameResultAnimation} 1s ease;

  & > h1 {
    font-size: 3rem;
    color: #ffeb3b;
  }

  & > h4 {
    font-size: 1.5rem;
    color: white;
  }
`;

export const ServiceError = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  & > h1 {
    font-size: 3rem;
    color: #ffcdd2;
  }

  & > h4 {
    font-size: 1.5rem;
    color: white;
  }
`;
