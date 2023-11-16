import React from 'react';
import styled from '@emotion/styled';

import { Rank, Suit } from '../../types';
import { suitColors, suitSymbols } from './constants';

type CardProps = {
  rank: Rank;
  suit: Suit;
};

const CardBase = styled.div`
  width: 100px;
  height: 140px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;
  margin: 10px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
`;

const CardContainer = styled(CardBase)<{ rank: Rank; suit: Suit }>`
  width: 100px;
  height: 150px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;
  margin: 10px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: ${(props) => suitColors[props.suit]};
  font-weight: bold;
`;

const CardRank = styled.div<{ rank: string; suitSymbol: string }>`
  position: absolute;
  font-size: 1.3rem;
  line-height: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:nth-of-type(1) {
    top: 5px;
    left: 5px;
  }
  &:nth-of-type(2) {
    right: 5px;
    bottom: 5px;
    transform: rotate(180deg);
  }

  &:before {
    display: block;
    content: '${(props) => props.rank}';
  }
  &:after {
    display: block;
    font-size: 1rem;
    content: '${(props) => props.suitSymbol}';
  }
`;

export const CardBack = styled(CardBase)`
  background-image: url('/card_back.jpg');
  background-size: contain;
  background-size: 104px;
  background-position-x: -2px;
  background-position-y: -2px;
`;

export const Card: React.FC<CardProps> = ({ rank, suit }) => {
  const suitSymbol = suitSymbols[suit];

  return (
    <CardContainer rank={rank} suit={suit}>
      {suitSymbol}
      <CardRank rank={rank} suitSymbol={suitSymbol} />
      <CardRank rank={rank} suitSymbol={suitSymbol} />
    </CardContainer>
  );
};
