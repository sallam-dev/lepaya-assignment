export type DifficultyLevel = 1 | 2 | 3;
export type CardsCount = 4 | 8 | 12;
export type GameCardsGenerationRequest = {
  difficultyLevel: DifficultyLevel;
};
export type GameCardsGenerationResponse = {
  cards: number[];
  solution: number[];
};
