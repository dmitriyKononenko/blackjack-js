import { rankValues } from './constants';
import { GameResult, Rank, Suit } from './types';

export class Card {
  constructor(
    public suit: Suit,
    public rank: Rank,
  ) {
    if (this.suit === undefined || this.rank === undefined) {
      throw new Error('Invalid Card data.');
    }
  }

  get value(): number {
    return rankValues[this.rank];
  }
}

export class Deck {
  constructor(private cards: Card[] = []) {
    if (!cards.length) {
      for (const suit of Object.values(Suit)) {
        if (typeof suit === 'string') {
          continue;
        }

        for (const rank of Object.values(Rank)) {
          this.cards.push(new Card(suit, rank));
        }
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): Card {
    return this.cards.pop()!;
  }

  toJSON() {
    return this.cards;
  }

  static fromJSON(json: unknown) {
    if (!Array.isArray(json)) {
      throw new Error('Invalid Deck JSON.');
    }

    return new Deck(json.map(({ suit, rank }) => new Card(suit, rank)));
  }
}

class Hand {
  private cards: Card[] = [];

  addCard(card: Card) {
    this.cards.push(card);
  }

  get value(): number {
    let value = 0;
    let aces = 0;

    for (const card of this.cards) {
      value += card.value;
      if (card.rank === Rank.Ace) {
        aces++;
      }
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  }

  get isHitTarget(): boolean {
    return this.value === 21;
  }

  get isBust(): boolean {
    return this.value > 21;
  }

  get isBlackjack(): boolean {
    return this.cards.length === 2 && this.isHitTarget;
  }

  getCards() {
    return this.cards;
  }
}

export class Player {
  constructor(
    public name: string,
    private hand: Hand = new Hand(),
  ) {}

  hit(card: Card) {
    this.hand.addCard(card);
  }

  get score(): number {
    return this.hand.value;
  }

  get isBust(): boolean {
    return this.hand.isBust;
  }

  get isBlackjack(): boolean {
    return this.hand.isBlackjack;
  }

  get isHitTarget(): boolean {
    return this.hand.isHitTarget;
  }

  toJSON() {
    return {
      name: this.name,
      cards: this.hand.getCards(),
    };
  }

  static fromJSON(json: unknown): Player {
    if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid Player JSON.');
    }

    if (!('name' in json) || !('cards' in json)) {
      throw new Error('Invalid Player JSON.');
    }

    const { name, cards } = json;

    if (typeof name !== 'string' || !Array.isArray(cards)) {
      throw new Error('Invalid Player JSON.');
    }

    const player = new Player(name);
    cards.forEach(({ suit, rank }) => player.hit(new Card(suit, rank)));

    return player;
  }
}

export class Dealer extends Player {
  constructor(hand?: Hand) {
    super('Dealer', hand);
  }

  play(deck: Deck) {
    while (this.score < 17) {
      this.hit(deck.draw());
    }
  }

  static fromJSON(json: unknown): Dealer {
    if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid Dealer JSON.');
    }

    if (!('cards' in json)) {
      throw new Error('Invalid Dealer JSON.');
    }

    const { cards } = json;

    if (!Array.isArray(cards)) {
      {
        throw new Error('Invalid Dealer JSON.');
      }
    }

    const dealer = new Dealer();
    cards.forEach(({ suit, rank }) => dealer.hit(new Card(suit, rank)));

    return dealer;
  }
}

export class BlackjackGame {
  constructor(
    private deck: Deck = new Deck(),
    private player: Player = new Player('Player'),
    private dealer: Dealer = new Dealer(),
  ) {}

  init() {
    this.deck.shuffle();

    this.player.hit(this.deck.draw());
    this.dealer.hit(this.deck.draw());
    this.player.hit(this.deck.draw());
    this.dealer.hit(this.deck.draw());
  }

  get isPlayerHitTarget() {
    return this.player.isHitTarget;
  }

  get playerScore() {
    return this.player.score;
  }

  get dealerScore() {
    return this.dealer.score;
  }

  playerHit() {
    if (!this.isGameOver) {
      this.player.hit(this.deck.draw());
    }
  }

  dealerHit() {
    if (!this.isGameOver) {
      this.dealer.play(this.deck);
    }
  }

  get gameResult(): GameResult | null {
    if (this.player.isBust) {
      return GameResult.Bust;
    }

    if (this.dealer.isBust) {
      return GameResult.Win;
    }

    if (this.player.isBlackjack && this.dealer.isBlackjack) {
      return GameResult.Push;
    }

    if (this.player.isBlackjack) {
      return GameResult.Blackjack;
    }

    if (this.dealer.isBlackjack) {
      return GameResult.DealerBlackjack;
    }

    if (this.player.score > this.dealer.score) {
      return GameResult.Win;
    }

    if (this.dealer.score > this.player.score) {
      return GameResult.DealerWin;
    }

    return GameResult.Push;
  }

  private get isGameOver(): boolean {
    return [this.player, this.dealer].some(
      ({ isBust, isBlackjack }) => isBust || isBlackjack,
    );
  }

  /**
   * Serializes the game state to an object for further storing.
   * @returns JSON object.
   */
  toJSON() {
    return {
      player: this.player.toJSON(),
      dealer: this.dealer.toJSON(),
      deck: this.deck.toJSON(),
    };
  }

  /**
   * Hydrates the game from JSON object.
   * @returns BlackjackGame instance.
   */
  static fromJSON(json: any) {
    const deck = Deck.fromJSON(json.deck);
    const player = Player.fromJSON(json.player);
    const dealer = Dealer.fromJSON(json.dealer);

    return new BlackjackGame(deck, player, dealer);
  }
}
