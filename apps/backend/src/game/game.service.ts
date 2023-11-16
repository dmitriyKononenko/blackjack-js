import { Injectable } from '@nestjs/common';

import { BlackjackGame, GameResult } from '../common';
import { GameStateDto } from './game.dto';
import { GameSessionService } from './game-session.service';

@Injectable()
export class GameService {
  constructor(private readonly gameSessionService: GameSessionService) {}

  /**
   * Starts a new game and returns the initial game state.
   * @returns The initial game state.
   */
  async start(): Promise<GameStateDto> {
    const game = new BlackjackGame();
    game.init();

    const sessionId = this.createSessionId();

    if (
      [GameResult.Blackjack, GameResult.DealerBlackjack].includes(
        game.gameResult,
      )
    ) {
      return GameStateDto.create(game, sessionId, true);
    }

    await this.gameSessionService.persist(sessionId, game);

    return GameStateDto.create(game, sessionId);
  }

  /**
   * Performs a hit action for the player and returns the updated game state.
   * @param sessionId The ID of the game session.
   * @returns The updated game state.
   */
  async hit(sessionId: string): Promise<GameStateDto> {
    const game = await this.gameSessionService.restore(sessionId);

    game.playerHit();

    if (game.gameResult === GameResult.Bust) {
      await this.gameSessionService.clean(sessionId);

      return GameStateDto.create(game, sessionId, true);
    }

    if (game.isPlayerHitTarget) {
      game.dealerHit();

      await this.gameSessionService.clean(sessionId);

      return GameStateDto.create(game, sessionId, true);
    }

    await this.gameSessionService.persist(sessionId, game);

    return GameStateDto.create(game, sessionId);
  }

  /**
   * Performs a stand action for the player and returns the updated game state.
   * @param sessionId The ID of the game session.
   * @returns The updated game state.
   */
  async stand(sessionId: string): Promise<GameStateDto> {
    const game = await this.gameSessionService.restore(sessionId);

    game.dealerHit();

    await this.gameSessionService.clean(sessionId);

    return GameStateDto.create(game, sessionId, true);
  }

  /**
   * Generates a new session ID.
   * @returns A random string.
   */
  private createSessionId() {
    return Math.random().toString(32);
  }
}
