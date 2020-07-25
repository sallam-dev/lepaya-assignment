<template>
  <component
    :is="component"
    :state="state"
    @flip-card="presenter.flipCard"
    @play="presenter.play"
    @select-difficulty="presenter.selectDifficulty"
    @start-over="presenter.startOver"
  ></component>
</template>

<script lang="ts">
import Vue, { Component } from 'vue';
import { createCardGamePresenter, CardsGameState } from '../../presenters/cards-game-presenter';
import HydratedStateComponent from './HydratedState.vue';
import InitialLoadingStateComponent from './InitialLoadingState.vue';

export default Vue.extend({
  name: 'CardsGame',
  data() {
    return {
      presenter: createCardGamePresenter(),
      state: undefined as unknown,
    };
  },
  components: {
    HydratedStateComponent,
    InitialLoadingStateComponent,
  },
  computed: {
    component(): Component {
      const state = this.state as CardsGameState;
      if (state.type === 'INITIAL_LOADING') return InitialLoadingStateComponent;
      return HydratedStateComponent;
    },
  },
  async created(): Promise<void> {
    this.state = this.presenter.state;
    this.presenter.subscribe(state => {
      this.state = state;
    });
    await this.presenter.init();
  },
  destroyed(): void {
    this.presenter.destroy();
  },
});
</script>
