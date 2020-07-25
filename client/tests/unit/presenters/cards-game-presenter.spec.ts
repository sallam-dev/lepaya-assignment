import {
  createCardGamePresenter,
  CardsGameState,
  HydratedState,
} from '@/presenters/cards-game-presenter';
import { assert } from 'chai';
import sinon from 'sinon';
import { NewCardsResponse } from '@/repositories/cards-game/dto';
import { http } from '@/gateways/http';

describe('Cards Game Presenter', function() {
  const sb = sinon.createSandbox();

  beforeEach('reset mocks and stubs', function() {
    sb.restore();
  });

  it('in in loading state upon creation', async function() {
    const presenter = createCardGamePresenter();
    let state;
    presenter.subscribe(presenterState => {
      state = presenterState;
    });

    assert.deepEqual(state, {
      type: 'INITIAL_LOADING',
    });
  });

  it('calls the backend and hydrates the state correctly', async function() {
    const newCardsResponse: NewCardsResponse = {
      cards: [20, 10, 18, 35],
      solution: [10, 18, 20, 35],
    };
    const presenter = createCardGamePresenter();
    let state!: HydratedState;
    presenter.subscribe(presenterState => {
      state = presenterState as HydratedState;
    });
    const backendStub = sb.stub(http, 'post').resolves(newCardsResponse);

    await presenter.init();

    sb.assert.calledOnceWithExactly(backendStub, {
      difficulyLevel: 1
    }, 'string');
    assert.equal(state.type, 'HYDRATED');
    assert.isFalse(state.disableGameSettings);
    assert.isTrue(state.hideGameResult);
    assert.isFalse(state.isWin);
    assert.equal(state.selectedDifficultyLevel, 1);
    assert.isEmpty(state.userSolution);
    assert.deepEqual(state.cards, [
      {
        covered: false,
        value: 20,
      },
      {
        covered: false,
        value: 10,
      },
      {
        covered: false,
        value: 18,
      },
      {
        covered: false,
        value: 35,
      },
    ]);
    assert.deepEqual(state.difficultySelections, [
      {
        cardsCount: 4,
        level: 1,
      },
      {
        cardsCount: 8,
        level: 2,
      },
      {
        cardsCount: 12,
        level: 3,
      },
    ]);
  });
});
