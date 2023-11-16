export enum Suit {
  Hearts,
  Diamonds,
  Clubs,
  Spades,
}

export enum Rank {
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A',
}

export enum GameResult {
  Win = 'Win',
  DealerWin = 'Dealer Win',
  Bust = 'Bust',
  Push = 'Push',
  Blackjack = 'Blackjack',
}

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Player {
  cards: Card[];
  score: number;
}

export interface Dealer {
  cards: (Card | null)[];
  score?: number;
}

export interface GameState {
  result: GameResult | null;
  player: Player;
  dealer: Dealer | Player;
  id: string;
}
