import { BlackjackGame, GameResult, Rank, Suit } from '../common';

export class CardDto {
  constructor(
    public suit: Suit,
    public rank: Rank,
  ) {}
}

export class PlayerDto {
  cards: CardDto[];
  score: number;

  constructor(cards: CardDto[], score: number) {
    this.cards = cards;
    this.score = score;
  }
}

export class DealerDto {
  cards: (CardDto | null)[];
  score: number;

  constructor(cards: CardDto[], score?: number, showCards = false) {
    if (showCards) {
      this.cards = cards;
      this.score = score;
    } else {
      this.cards = cards.map((card, index) => (index ? null : card));
    }
  }
}

export class GameStateDto {
  result: GameResult | null;
  player: PlayerDto;
  dealer: DealerDto | PlayerDto;
  id: string;

  static create(
    game: BlackjackGame,
    id: string,
    isFinished = false,
  ): GameStateDto {
    const { player, dealer } = game.toJSON();

    return Object.assign(new GameStateDto(), {
      id,
      result: isFinished ? game.gameResult : null,
      player: new PlayerDto(
        player.cards.map(({ suit, rank }) => new CardDto(suit, rank)),
        game.playerScore,
      ),
      dealer: new DealerDto(
        dealer.cards.map(({ suit, rank }) => new CardDto(suit, rank)),
        game.dealerScore,
        isFinished,
      ),
    });
  }
}
