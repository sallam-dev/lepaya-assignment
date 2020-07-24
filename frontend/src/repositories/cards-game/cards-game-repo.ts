import { DifficultyLevel, GameCards } from '@/models/cards-game';
import { http } from '@/gateways/http';
import { NewCardsRequest, NewCardsResponse } from './dto';

export const cardsGameRepo = {
  async getNewCards(difficultyLevel: DifficultyLevel): Promise<GameCards> {
    const request: NewCardsRequest = {
      difficultyLevel,
    };
    const response: NewCardsResponse = await http.post(
      'http://localhost:9090/api/new-cards',
      request
    );
    return {
      cards: response.cards,
      solution: response.solution,
    };
  },
};
