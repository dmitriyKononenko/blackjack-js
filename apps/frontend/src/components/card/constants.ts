import { Suit } from '../../types';

const BLACK_COLOR = '#212121';
const RED_COLOR = '#D32F2F';

export const suitColors: Record<Suit, string> = {
  [Suit.Clubs]: BLACK_COLOR,
  [Suit.Diamonds]: RED_COLOR,
  [Suit.Hearts]: RED_COLOR,
  [Suit.Spades]: BLACK_COLOR,
};

export const suitSymbols: Record<Suit, string> = {
  [Suit.Clubs]: '♣',
  [Suit.Diamonds]: '♦',
  [Suit.Hearts]: '♥',
  [Suit.Spades]: '♠',
};
