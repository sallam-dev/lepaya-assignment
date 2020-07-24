import { generateRandomInt } from '../utilities/random';
import {
  DifficultyLevel,
  GameCardsGenerationResponse,
  GameCardsGenerationRequest,
  CardsCount,
} from '../models/game-card';

export async function processGameCardsGenerationRequest(
  request: unknown
): Promise<GameCardsGenerationResponse> {
  const { difficultyLevel } = request as GameCardsGenerationRequest;
  const cards = generateCards(difficultyLevel);
  const solution = generateSolution(cards);
  return {
    cards,
    solution,
  };
}

function generateCards(difficultyLevel: DifficultyLevel): number[] {
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

  return cardValues;
}

function generateSolution(cards: number[]): number[] {
  const cardsCopy = cards.slice();
  cardsCopy.sort((a, b) => a - b);
  return cardsCopy;
}

function getCardsCount(difficultyLevel: DifficultyLevel): CardsCount {
  switch (difficultyLevel) {
    case 1:
      return 4;
    case 2:
      return 8;
    case 3:
      return 12;
    default:
      throw new Error(
        'Unsupported difficulty level, please choose a difficulty level from 1 to 3'
      );
  }
}
