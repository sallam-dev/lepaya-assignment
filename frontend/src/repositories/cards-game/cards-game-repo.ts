import { DifficultyLevel } from '@/models/cards-game';
import { NewCardsRequest, NewCardsResponse } from './dto';
import { http } from '@/gateways/http';

export const cardsGameRepo = {
  async getNewCards(difficultyLevel: DifficultyLevel) {
    const request: NewCardsRequest = {
      difficultyLevel
    };
    const response: NewCardsResponse = await http.post('/api/new-cards', request);
    return response
  }
}
