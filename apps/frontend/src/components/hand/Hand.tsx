import React from 'react';
import styled from '@emotion/styled';

import { Card } from '../../types';
import { Card as CardComponent, CardBack } from '../card';

const StyledHand = styled.div`
  position: relative;
`;

const CardWrapper = styled.div<{ index: number }>`
  position: absolute;
  left: ${({ index }) => `calc(${index * 30}px - 50px)`};
  top: ${({ index }) => index * 5}px;
  transform: ${({ index }) => `rotate(${(index - 2) * 5}deg)`} translateX(-50%);
`;

interface HandProps {
  cards: (Card | null)[];
}

export const Hand: React.FC<HandProps> = ({ cards }) => {
  return (
    <StyledHand>
      {cards.map((card, index) => (
        <CardWrapper key={`${card?.rank}-${card?.suit}`} index={index}>
          {card ? (
            <CardComponent rank={card.rank} suit={card.suit} />
          ) : (
            <CardBack />
          )}
        </CardWrapper>
      ))}
    </StyledHand>
  );
};
