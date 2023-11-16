import { Controller, Param, Post } from '@nestjs/common';

import { GameStateDto } from './game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('')
  start(): Promise<GameStateDto> {
    return this.gameService.start();
  }

  @Post(':sessionId/hit')
  hit(@Param('sessionId') sessionId: string): Promise<GameStateDto> {
    return this.gameService.hit(sessionId);
  }

  @Post(':sessionId/stand')
  stand(@Param('sessionId') sessionId: string): Promise<GameStateDto> {
    return this.gameService.stand(sessionId);
  }
}
