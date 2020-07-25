import { DifficultyLevel, GameCards } from '@/models/cards-game';
import { http } from '@/gateways/http';
import { NewCardsRequest, NewCardsResponse } from './dto';

export const cardsGameRepo = {
  async getNewCards(difficultyLevel: DifficultyLevel): Promise<GameCards> {
    const request: NewCardsRequest = {
      difficultyLevel,
    };
    const response: NewCardsResponse = await http.post(
      '/api/new-cards',
      request
    );
    return {
      cards: response.cards,
      solution: response.solution,
    };
  },
};
