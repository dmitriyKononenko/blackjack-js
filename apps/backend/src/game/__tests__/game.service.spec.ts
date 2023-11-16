import { Test, TestingModule } from '@nestjs/testing';

import {
  BlackjackGame,
  Card,
  Deck,
  GameResult,
  Rank,
  Suit,
} from '../../common';
import { GameService } from '../game.service';
import { GameSessionService } from '../game-session.service';

describe('GameService', () => {
  const mockSessionId = '123';

  let service: GameService;
  const mockGameSessionService = {
    persist: jest.fn(),
    restore: jest.fn(),
    clean: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: GameSessionService, useValue: mockGameSessionService },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('start', () => {
    it('should return a game state', async () => {
      const gameResultSpy = jest
        .spyOn(BlackjackGame.prototype, 'gameResult', 'get')
        .mockReturnValue(GameResult.Push);

      await expect(service.start()).resolves.toEqual(
        expect.objectContaining({
          player: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
            score: expect.any(Number),
          }),
          dealer: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
          }),
        }),
      );

      expect(mockGameSessionService.persist).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(BlackjackGame),
      );

      gameResultSpy.mockRestore();
    });

    it('should return a game state with player blackjack result', async () => {
      const gameResultSpy = jest
        .spyOn(BlackjackGame.prototype, 'gameResult', 'get')
        .mockReturnValue(GameResult.Blackjack);

      await expect(service.start()).resolves.toEqual(
        expect.objectContaining({
          result: GameResult.Blackjack,
          player: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
            score: expect.any(Number),
          }),
          dealer: expect.objectContaining({
            cards: expect.not.arrayContaining([null]),
          }),
        }),
      );

      expect(mockGameSessionService.persist).not.toHaveBeenCalled();

      gameResultSpy.mockRestore();
    });

    it('should return a game state with dealer blackjack result', async () => {
      const gameResultSpy = jest
        .spyOn(BlackjackGame.prototype, 'gameResult', 'get')
        .mockReturnValue(GameResult.DealerBlackjack);

      await expect(service.start()).resolves.toEqual(
        expect.objectContaining({
          result: GameResult.DealerBlackjack,
          player: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
            score: expect.any(Number),
          }),
          dealer: expect.objectContaining({
            cards: expect.not.arrayContaining([null]),
          }),
        }),
      );

      expect(mockGameSessionService.persist).not.toHaveBeenCalled();

      gameResultSpy.mockRestore();
    });
  });

  describe('hit', () => {
    it('should add a card to player hand and return game state', async () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Three))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Four))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Three))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Four));

      const game = new BlackjackGame(deck);
      game.init();

      const initialPlayerScore = game.playerScore;
      const initialDealerScore = game.dealerScore;

      mockGameSessionService.restore.mockResolvedValueOnce(game);

      await expect(service.hit(mockSessionId)).resolves.toEqual(
        expect.objectContaining({
          result: null,
          player: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
            score: 17,
          }),
          dealer: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
              null,
            ]),
          }),
        }),
      );

      expect(initialPlayerScore).toEqual(13);
      expect(game.playerScore).toEqual(17);
      expect(game.dealerScore).toEqual(initialDealerScore);
      expect(mockGameSessionService.persist).toHaveBeenCalledWith(
        mockSessionId,
        expect.any(BlackjackGame),
      );
      expect(mockGameSessionService.clean).not.toHaveBeenCalled();
    });

    it(`should add a card to player hand and return with "${GameResult.Bust}" result`, async () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Eight))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Three))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Four));

      const game = new BlackjackGame(deck);
      game.init();

      const initialPlayerScore = game.playerScore;

      mockGameSessionService.restore.mockResolvedValueOnce(game);

      await expect(service.hit(mockSessionId)).resolves.toEqual(
        expect.objectContaining({
          result: GameResult.Bust,
          player: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
            score: 22,
          }),
          dealer: expect.objectContaining({
            cards: expect.not.arrayContaining([null]),
          }),
        }),
      );

      expect(initialPlayerScore).toEqual(18);
      expect(game.playerScore).toEqual(22);
      expect(mockGameSessionService.clean).toHaveBeenCalledWith(mockSessionId);
      expect(mockGameSessionService.persist).not.toHaveBeenCalled();
    });

    it('should move to the dealer turn if player reached 21 scores', async () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Eight))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Three))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Three))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Four));

      const game = new BlackjackGame(deck);
      game.init();

      const initialPlayerScore = game.playerScore;
      const initialDealerScore = game.dealerScore;

      mockGameSessionService.restore.mockResolvedValueOnce(game);

      await expect(service.hit(mockSessionId)).resolves.toEqual(
        expect.objectContaining({
          result: GameResult.Win,
          player: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
            score: 21,
          }),
          dealer: expect.objectContaining({
            cards: expect.not.arrayContaining([null]),
          }),
        }),
      );

      expect(initialPlayerScore).toEqual(18);
      expect(game.playerScore).toEqual(21);
      expect(initialDealerScore).toEqual(13);
      expect(game.dealerScore).toEqual(17);
      expect(mockGameSessionService.clean).toHaveBeenCalledWith(mockSessionId);
      expect(mockGameSessionService.persist).not.toHaveBeenCalled();
    });
  });

  describe('stand', () => {
    it('should hit dealer and return game state', async () => {
      const deck = new Deck();

      jest
        .spyOn(deck, 'draw')
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Hearts, Rank.Ten))
        .mockReturnValueOnce(new Card(Suit.Diamonds, Rank.Six))
        .mockReturnValueOnce(new Card(Suit.Clubs, Rank.Four));

      const game = new BlackjackGame(deck);
      game.init();

      const initialPlayerScore = game.playerScore;
      const initialDealerScore = game.dealerScore;

      mockGameSessionService.restore.mockResolvedValueOnce(game);

      await expect(service.stand(mockSessionId)).resolves.toEqual(
        expect.objectContaining({
          result: GameResult.Push,
          player: expect.objectContaining({
            cards: expect.arrayContaining([
              expect.objectContaining({
                suit: expect.any(Number),
                rank: expect.any(String),
              }),
            ]),
            score: 20,
          }),
          dealer: expect.objectContaining({
            cards: expect.not.arrayContaining([null]),
          }),
        }),
      );

      expect(initialPlayerScore).toEqual(20);
      expect(game.playerScore).toEqual(20);

      expect(initialDealerScore).toEqual(16);
      expect(game.dealerScore).toEqual(20);

      expect(mockGameSessionService.clean).toHaveBeenCalledWith(mockSessionId);
    });
  });
});
