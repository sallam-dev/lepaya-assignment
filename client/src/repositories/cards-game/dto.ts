import { DifficultyLevel } from '@/models/cards-game';

export type NewCardsResponse = {
  cards: number[];
  solution: number[];
};
export type NewCardsRequest = {
  difficultyLevel: DifficultyLevel;
};
