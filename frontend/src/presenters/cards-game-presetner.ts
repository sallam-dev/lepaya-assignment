import { Card, DifficultyLevel, CardsCount } from '@/models/cards-game';

export class CardsGamePresenter {
  private _solution: number[] = [];
  private _userSolution: number[] = [];

  state: GameCardState;

  constructor() {
    this.state = {
      type: 'INITIAL',
      allowedDifficultyLevels: [1, 2, 3],
      difficultyLevel: 1,
      cards: generateCards(1),
      disableGameSettings: false,
      hideGameResult: true,
    };
    this._solution = generateSolution(this.state.cards);
  }

  selectDifficultyLevel(level: DifficultyLevel): void {
    this._setState({
      ...this.state,
      difficultyLevel: level,
      cards: generateCards(level),
    });
    this._solution = generateSolution(this.state.cards);
  }

  play(): void {
    this._setState({
      ...this.state,
      type: 'PLAYING',
      cards: this.state.cards.map((card) => ({
        ...card,
        covered: true,
      })),
      disableGameSettings:true,
      hideGameResult: true,
    });
  }

  playAgain(): void {
    this._setState({
      type: 'INITIAL',
      allowedDifficultyLevels: [1, 2, 3],
      difficultyLevel: 1,
      cards: generateCards(1),
      disableGameSettings: false,
      hideGameResult: true,
    })
    this._userSolution = [];
    this._solution = generateSolution(this.state.cards);

  }

  flipCard(index: number): void {
    const card = this.state.cards[index];
    if (card.covered) {
      this._userSolution.push(card.value);
      const flippedCard: Card = {
        ...card,
        covered: false,
      };
      // this is a side effect that could be managed better managed with observables.
      const cards = [...this.state.cards.slice(0, index), flippedCard, ...this.state.cards.slice(index + 1)];
      this._decidePlayingOrFinishState(cards);
    }
  }

  private _decidePlayingOrFinishState(cards: Card[]): void {
    if (cards.length === this._userSolution.length) {
      const isWin = this._userSolution.every((value, index) => value === this._solution[index]);
      this._setState({
        ...this.state,
        type: 'FINISHED',
        cards,
        isWin,
        disableGameSettings: true,
        hideGameResult: false,
      });
    } else {
      this._setState({
        ...this.state,
        cards,
      });
    }
  }

  private _setState(newState: GameCardState): void {
    this.state = newState;
  }
}

/**
 * Generate a random positive integer between 1 and 100
 */
function generateRandomInt(): number {
  const min = 1;
  const max = 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate an array of cards given a difficulty level
 * available difficulty levels are, 1 (4 cards), 2 (8 cards), 3 (12 cards)
 * @param {number} difficultyLevel value from 1 (easiest) to 3 (hardest)
 */
function generateCards(difficultyLevel: DifficultyLevel): Card[] {
  const cardsCount = getCardsCount(difficultyLevel);
  const cardValues: number[] = [];
  function getUniqueNumber(): number {
    const value = generateRandomInt();
    if (cardValues.includes(value)) {
      return getUniqueNumber();
    }
    return value;
  }
  for (let i = 0; i < cardsCount; i++) {
    cardValues.push(getUniqueNumber());
  }
  return cardValues.map((value) => ({
    value,
    covered: false,
  }));
}

function generateSolution(cards: Card[]): number[] {
  const values = cards.map((card) => card.value);
  return values.sort((a, b) => a - b);
}

/**
 * returns the number of cards for each difficulty level
 * @param {number} difficultyLevel value from 1 (easiest) to 3 (hardest)
 */
function getCardsCount(difficultyLevel: DifficultyLevel): CardsCount {
  switch (difficultyLevel) {
    case 1:
      return 4;
    case 2:
      return 8;
    case 3:
      return 12;
    default:
      throw new Error('Unsupported difficulty level, please choose a difficulty level from 1 to 3');
  }
}

type CommonState = {
  type: string;
  cards: Card[];
  difficultyLevel: DifficultyLevel;
  allowedDifficultyLevels: DifficultyLevel[];
  disableGameSettings: boolean;
  hideGameResult: boolean;
}
type InitialState = CommonState & {
  type: 'INITIAL';
  disableGameSettings: false;
  hideGameResult: true;
}
type PlayingState = CommonState & {
  type: 'PLAYING';
  disableGameSettings: true;
  hideGameResult: true;
}
type FinishedState = CommonState & {
  type: 'FINISHED';
  disableGameSettings: true;
  hideGameResult: false;
  isWin: boolean;
}

export type GameCardState = InitialState | PlayingState | FinishedState
