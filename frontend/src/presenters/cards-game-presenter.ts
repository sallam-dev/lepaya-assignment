import { DifficultyLevel, CardsCount } from '@/models/cards-game';
import { cardsGameRepo } from '@/repositories/cards-game/cards-game-repo';

export function createCardGamePresenter(): CardGamePresenter {
  let _observers: Function[] = [];
  let _state: CardsGameState = {
    type: 'INITIAL_LOADING',
  };
  let _solution: number[] = [];
  const _difficultySelections: DifficultySelections = [
    { level: 1, cardsCount: 4 },
    { level: 2, cardsCount: 8 },
    { level: 3, cardsCount: 12 },
  ];
  const _initialDifficulty = 1;

  function _notifySubscribers() {
    _observers.forEach(fn => fn(_state));
  }

  function _setState(newState: CardsGameState) {
    _state = newState;
    _notifySubscribers();
  }

  async function _loadCards(difficultyLevel: DifficultyLevel): Promise<Card[]> {
    const gameCards = await cardsGameRepo.getNewCards(difficultyLevel);
    _solution = gameCards.solution;
    return gameCards.cards.map(value => {
      return {
        value,
        covered: false,
      };
    });
  }
  function _decideWinning(cards: Card[], userSolution: number[]): void {
    const currentState = _state as HydratedState;
    if (userSolution.length === _solution.length) {
      const isWin = currentState.userSolution.every((value, index) => value === _solution[index]);
      _setState({
        ...currentState,
        cards,
        isWin,
        hideGameResult: false,
        userSolution,
      });
    } else {
      _setState({
        ...currentState,
        userSolution,
        cards,
      });
    }
  }

  const presenter: CardGamePresenter = {
    get state(): CardsGameState {
      return _state;
    },
    async init(): Promise<void> {
      const cards = await _loadCards(_initialDifficulty);
      _setState({
        type: 'HYDRATED',
        cards,
        selectedDifficultyLevel: _initialDifficulty,
        difficultySelections: _difficultySelections,
        disableGameSettings: false,
        hideGameResult: true,
        userSolution: [],
        isWin: false,
      });
    },
    async selectDifficulty(level: DifficultyLevel): Promise<void> {
      const cards = await _loadCards(level);
      _setState({
        ...(_state as HydratedState),
        disableGameSettings: false,
        cards,
      });
    },
    play(): void {
      const currentState = _state as HydratedState;
      _setState({
        ...currentState,
        cards: currentState.cards.map(card => {
          return {
            ...card,
            covered: true,
          };
        }),
        disableGameSettings: true,
      });
    },
    flipCard(index: number): void {
      const currentState = _state as HydratedState;
      const card = currentState.cards[index];
      if (card.covered) {
        const userSolution = [...currentState.userSolution, card.value];
        const flippedCard: Card = {
          ...card,
          covered: false,
        };
        const cards = [
          ...currentState.cards.slice(0, index),
          flippedCard,
          ...currentState.cards.slice(index + 1),
        ];
        _decideWinning(cards, userSolution);
      }
    },
    async startOver(): Promise<void> {
      const cards = await _loadCards(_initialDifficulty);
      _setState({
        ...(_state as HydratedState),
        cards,
        userSolution: [],
        selectedDifficultyLevel: _initialDifficulty,
        disableGameSettings: false,
        hideGameResult: true,
        isWin: false,
      });
    },

    subscribe(observer: (state: CardsGameState) => void): void {
      _observers.push(observer);
    },
    destroy(): void {
      _observers = [];
    },
  };
  return presenter;
}

type CardGamePresenter = {
  init(): Promise<void>;
  selectDifficulty(level: DifficultyLevel): Promise<void>;
  play(): void;
  startOver(): Promise<void>;
  flipCard(index: number): void;
  subscribe(fn: (state: CardsGameState) => void): void;
  destroy(): void;
  state: CardsGameState;
};

type DifficultySelections = Array<{
  level: DifficultyLevel;
  cardsCount: CardsCount;
}>;

export type Card = {
  value: number;
  covered: boolean;
};

export type InitialLoadingState = {
  type: 'INITIAL_LOADING';
};
export type HydratedState = {
  type: 'HYDRATED';
  cards: Card[];
  userSolution: number[];
  selectedDifficultyLevel: number;
  difficultySelections: DifficultySelections;
  disableGameSettings: boolean;
  hideGameResult: boolean;
  isWin: boolean;
};

export type CardsGameState = HydratedState | InitialLoadingState;
