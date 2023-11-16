class GameService {
  private readonly serviceHost: string;

  constructor() {
    this.serviceHost =
      process.env.REACT_APP_GAME_SERVICE_API_HOST ?? 'http://localhost:3000';
  }

  async start() {
    const response = await fetch(`${this.serviceHost}/api/v1/game`, {
      method: 'POST',
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  async stand(sessionId: string) {
    const response = await fetch(
      `${this.serviceHost}/api/v1/game/${sessionId}/stand`,
      {
        method: 'POST',
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  async hit(sessionId: string) {
    const response = await fetch(
      `${this.serviceHost}/api/v1/game/${sessionId}/hit`,
      {
        method: 'POST',
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }
}

export const gameService = new GameService();
