export default class CardsGamePresenter {
  private _solution: number[];
  private _userSolution: number[];
  state: UIState;

  constructor() {
    this.state = {
      type: 'INITIAL',
      allowedDifficultyLevels: [1, 2, 3],
      difficultyLevel: 1,
      cards: generateCards(3),
    }
    this._userSolution = [];
    this._solution = generateSolution(this.state.cards);
  }

  /**
   * difficulty levels can only be set when at the initial state
   */
  selectDifficultyLevel(level: DifficultyLevel):void {
    this._setState({
      ...this.state,
      difficultyLevel: level,
      cards: generateCards(level),
    })
    this._solution = generateSolution(this.state.cards)
  }

  play():void {
   this._setState({
     ...this.state,
     type: 'PLAYING',
     cards: this.state.cards.map(card => {
       return {
         ...card,
         state: 'BLANK_SIDE'
       }
     })
   })
  }

  flipCard(index: number): void {
    const card = this.state.cards[index];
    if(card.state != 'VALUE_SIDE') {
      this._userSolution.push(card.value)
      const flippedCard: Card = {
        ...card,
        state: 'VALUE_SIDE'
      }
      // this is a side effect that could be managed better managed with observables.
      const cards = [...this.state.cards.slice(0, index), flippedCard, ...this.state.cards.slice(index + 1)]
      this._decidePlayingOrFinishState(cards)
    }
  }

  private _decidePlayingOrFinishState(cards: Card[]):void {
    if(cards.length === this._solution.length) {
      const isWin = this._userSolution.every((value, index) => value === this._solution[index])
      this._setState({
        ...this.state,
        type: 'FINISHED',
        cards,
        isWin
      })
    } else {
      this._setState({
        ...this.state,
        cards,
      })
    }
  }


  private _setState(newState: UIState):void {
    this.state = newState
  }
}

/**
 * Generate a random positive integer between 1 and 100
 */
function generateRandomInt(): number {
  const min = 1;
  const max = 100
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate an array of cards given a difficulty level
 * available difficulty levels are, 1 (4 cards), 2 (8 cards), 3 (12 cards)
 * @param {number} difficultyLevel value from 1 (easiest) to 3 (hardest)
 */
function generateCards(difficultyLevel: DifficultyLevel): Card[] {
  const cardsCount = getCardsCount(difficultyLevel)
  const cardValues: number[] = []
  function getUniqueNumber(): number {
    const value = generateRandomInt();
    if(cardValues.includes(value)) {
      return getUniqueNumber();
    } else {
      return value
    }
  }
  for (let i = 0; i < cardsCount; i++) {
    cardValues.push(getUniqueNumber())
  }
  return cardValues.map((value) => {
    return {
      value,
      state: 'INITIAL'
    }
  })
}

function generateSolution(cards: Card[]): number[] {
  const values = cards.map(card => card.value)
  return values.sort((a, b) => a-b)
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
      throw new Error('Unsupported difficulty level, please choose a difficulty level from 1 to 3')
  }
}

type DifficultyLevel = 1 | 2 | 3;
type CardsCount = 4 | 8 | 12;
type Card = {
  value: number;
  state: CardState
}
type CardState = 'INITIAL' | 'BLANK_SIDE' | 'VALUE_SIDE'

type InitialUIState = {
  type: 'INITIAL',
  cards: Card [];
  difficultyLevel: DifficultyLevel
  allowedDifficultyLevels: DifficultyLevel[]
}
type PlayingUIState = {
  type: 'PLAYING';
  cards: Card [];
  difficultyLevel: DifficultyLevel
  allowedDifficultyLevels: DifficultyLevel[]
}

type FinishedUIState = {
  type: 'FINISHED';
  cards: Card [];
  difficultyLevel: DifficultyLevel
  allowedDifficultyLevels: DifficultyLevel[]
  isWin: boolean;
}

type UIState = InitialUIState | PlayingUIState | FinishedUIState;
