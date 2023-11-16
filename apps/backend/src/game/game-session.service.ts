import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, Inject, Injectable } from '@nestjs/common';

import { BlackjackGame } from '../common';

/**
 * This service is responsible for persisting, restoring and cleaning game sessions using an in-memory cache.
 *
 * @remarks
 * This implementation is suitable for local development, but not for production.
 * The reason is simplify the logic
 */
@Injectable()
export class GameSessionService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Persists the given game state to the cache.
   *
   * @param sessionId - The ID of the game session.
   * @param game - The game state to persist.
   */
  async persist(sessionId: string, game: BlackjackGame): Promise<void> {
    await this.cacheManager.set(sessionId, JSON.stringify(game.toJSON()));
  }

  /**
   * Restores the game state from the cache for the given session ID.
   *
   * @param sessionId - The ID of the game session.
   * @returns The restored game state.
   * @throws HttpException if the game session is not found.
   */
  async restore(sessionId: string): Promise<BlackjackGame> {
    try {
      const cachedGame = await this.cacheManager.get(sessionId);

      if (!cachedGame || typeof cachedGame !== 'string') {
        throw new Error('Game session not found.');
      }

      return BlackjackGame.fromJSON(JSON.parse(cachedGame));
    } catch (error) {
      console.log(`Unable to restore the game. Error: ${error.message}`);

      throw new HttpException('Please start a new game first.', 404);
    }
  }

  /**
   * Deletes the game state from the cache for the given session ID.
   *
   * @param sessionId - The ID of the game session.
   */
  async clean(sessionId: string): Promise<void> {
    await this.cacheManager.del(sessionId);
  }
}
