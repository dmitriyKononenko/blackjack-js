import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameSessionService } from './game-session.service';

const HOUR_MS = 1000 * 60 * 60;

@Module({
  imports: [CacheModule.register({ ttl: HOUR_MS })],
  controllers: [GameController],
  providers: [GameService, GameSessionService],
})
export class GameModule {}
