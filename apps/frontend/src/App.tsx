import { useState } from 'react';

import {
  Board,
  Button,
  ControlsLayout,
  DealerHand,
  GameResult,
  PlayerHand,
  Score,
  ServiceError,
  StartButton,
  Hand,
} from './components';
import { gameService } from './api';
import { GameState } from './types';

function App() {
  const [gameData, setGameData] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    try {
      const data = await gameService.start();
      setError(null);
      setGameData(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleStand = async () => {
    try {
      const data = await gameService.stand(gameData?.id ?? '');

      setError(null);
      setGameData(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleHit = async () => {
    try {
      const data = await gameService.hit(gameData?.id ?? '');

      setError(null);
      setGameData(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const isDealerWinner = gameData?.result?.includes('Dealer');

  if (error) {
    return (
      <Board>
        <ServiceError>
          <h1>An error ocurred, sorry.</h1>
          <h4>{error}</h4>
          <Button color="#43A047" onClick={handleStart}>
            Try again
          </Button>
        </ServiceError>
      </Board>
    );
  }

  if (!gameData)
    return (
      <Board>
        <StartButton color="#43A047" onClick={handleStart}>
          Start
        </StartButton>
      </Board>
    );

  const playerCards = gameData?.player?.cards ?? [];
  const dealerCards = gameData?.dealer?.cards ?? [];

  return (
    <Board>
      <DealerHand>
        <Hand cards={dealerCards} />
      </DealerHand>
      <PlayerHand>
        <Hand cards={playerCards} />
      </PlayerHand>

      {gameData.result && (
        <GameResult>
          <h1>{gameData.result}</h1>
          {isDealerWinner && <h4>With score: {gameData.dealer.score}</h4>}
        </GameResult>
      )}
      <ControlsLayout>
        <Score>
          Score: <b>{gameData?.player?.score}</b>
        </Score>
        {gameData.result ? (
          <Button color="#43A047" onClick={handleStart}>
            Play again
          </Button>
        ) : (
          <>
            <Button color="#C62828" onClick={handleStand}>
              Stand
            </Button>
            <Button color="#F9A825" onClick={handleHit}>
              Hit
            </Button>
          </>
        )}
      </ControlsLayout>
    </Board>
  );
}

export default App;
