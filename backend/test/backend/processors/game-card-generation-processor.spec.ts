import { assert } from 'chai';
import { GameCardsGenerationRequest } from '../../../models/game-card';
import { processGameCardsGenerationRequest } from '../../../processors/game-card-generation-processor';
describe('GameCardsGenerationProcessor', async function () {
  it('generates the cards and solution', async function () {
    const request: GameCardsGenerationRequest = {
      difficultyLevel: 1,
    };

    const response = await processGameCardsGenerationRequest(request);
    const expectedSolution = response.cards.slice();
    expectedSolution.sort((a, b) => a - b);

    assert.equal(response.cards.length, 4);
    assert.deepEqual(response.solution, expectedSolution);
  });
  it('rejects with an error if the difficulty level is greater than 3', async function () {
    const request: GameCardsGenerationRequest = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      difficultyLevel: 4,
    };
    let error!: Error;

    await processGameCardsGenerationRequest(request).catch((err) => {
      error = err;
    });

    assert.equal(
      error.message,
      'Unsupported difficulty level, please choose a difficulty level from 1 to 3'
    );
  });
});
