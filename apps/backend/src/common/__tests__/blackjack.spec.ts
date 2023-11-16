import { GameResult, Rank, Suit } from '../types';
import { BlackjackGame, Card, Dealer, Deck, Player } from '../blackjack';

describe('BlackjackGame', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('init', () => {
    it('should initialize the game', () => {
      const deck = new Deck();
      const player = new Player('Player');
      const dealer = new Dealer();
      const game = new BlackjackGame(deck, player, dealer);

      expect(game.playerScore).toEqual(0);

      game.init();

      expect(game.playerScore).toBeGreaterThan(1);
    });
  });

  describe('playerHit', () => {
    it('should allow the player to hit', () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Two))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Two))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Five))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Three));

      const game = new BlackjackGame(deck);
      game.init();

      const initialPlayerScore = game.playerScore;

      game.playerHit();

      expect(game.playerScore).toBeGreaterThan(initialPlayerScore);
    });

    it('should skip hit if game is over', () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ace))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Two))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Five));

      const game = new BlackjackGame(deck);
      game.init();

      const initialPlayerScore = game.playerScore;

      game.playerHit();

      expect(game.playerScore).toEqual(initialPlayerScore);
    });
  });

  describe('dealerHit', () => {
    it('should allow the dealer to hit', () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Two))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Five));

      const game = new BlackjackGame(deck);
      game.init();

      const initialDealerScore = game.dealerScore;

      game.dealerHit();

      expect(game.dealerScore).toBeGreaterThan(initialDealerScore);
    });

    it('should skip hit if game is over', () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Two))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ace));

      const game = new BlackjackGame(deck);
      game.init();

      const initialPlayerScore = game.playerScore;

      game.playerHit();

      expect(game.playerScore).toEqual(initialPlayerScore);
    });
  });

  describe('gameResult', () => {
    it(`should return "${GameResult.Bust}" if player bust`, () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Nine))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Three))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Three));

      const game = new BlackjackGame(deck);
      game.init();
      game.playerHit();

      expect(game.playerScore).toBeGreaterThan(21);
      expect(game.gameResult).toEqual(GameResult.Bust);
    });

    it(`should return "${GameResult.Win}" if dealer is bust`, () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Nine))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Six))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Eight));

      const game = new BlackjackGame(deck);
      game.init();
      game.dealerHit();

      expect(game.dealerScore).toBeGreaterThan(21);
      expect(game.gameResult).toEqual(GameResult.Win);
    });

    it(`should return "${GameResult.Push}" if player and dealer have blackjack`, () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ace))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ace));

      const game = new BlackjackGame(deck);
      game.init();

      expect(game.gameResult).toEqual(GameResult.Push);
    });

    it(`should return "${GameResult.Blackjack}" if player has blackjack`, () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ace))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Seven));

      const game = new BlackjackGame(deck);
      game.init();

      expect(game.playerScore).toEqual(21);
      expect(game.gameResult).toEqual(GameResult.Blackjack);
    });

    it(`should return "${GameResult.Win}" if player has higher score than dealer`, () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Seven))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Eight))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Nine));

      const game = new BlackjackGame(deck);
      game.init();

      expect(game.playerScore).toEqual(18);
      expect(game.dealerScore).toEqual(16);
      expect(game.gameResult).toEqual(GameResult.Win);
    });

    it(`should return "${GameResult.DealerWin}" if dealer has higher score than player`, () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Nine))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Hearts, Rank.Nine))
        .mockReturnValueOnce(new Card(Suit.Spades, Rank.Ten));

      const game = new BlackjackGame(deck);
      game.init();

      expect(game.playerScore).toEqual(18);
      expect(game.dealerScore).toEqual(20);
      expect(game.gameResult).toEqual(GameResult.DealerWin);
    });
  });

  describe('toJSON', () => {
    it('should serialize the game state to JSON', () => {
      const game = new BlackjackGame();
      game.init();

      const json = game.toJSON();

      expect(json).toEqual(
        expect.objectContaining({
          player: expect.objectContaining({
            name: expect.any(String),
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
          }),
          dealer: expect.objectContaining({
            name: expect.any(String),
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
          }),
          deck: expect.arrayContaining([
            expect.objectContaining({
              suit: expect.any(Number),
              rank: expect.any(String),
            }),
          ]),
        }),
      );
    });
  });

  describe('fromJSON', () => {
    it('should deserialize the game state from JSON object', () => {
      const game = new BlackjackGame();
      game.init();

      const json = game.toJSON();

      expect(() => BlackjackGame.fromJSON(json)).not.toThrow();

      const newGame = BlackjackGame.fromJSON(json);

      expect(newGame).toBeInstanceOf(BlackjackGame);
    });
  });
});
