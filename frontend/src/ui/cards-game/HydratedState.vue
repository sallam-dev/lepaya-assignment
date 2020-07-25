<template>
  <div class="container">
    <form class="settings" @submit.prevent="handlePlay">
      <label for="difficulty-level">Select difficulty level: </label>
      <select
        @input="handleDifficultySelection"
        id="difficulty-level"
        :disabled="state.disableGameSettings"
        :value="state.selectedDifficultyLevel"
        name="difficulty-level"
        required
      >
        <option
          v-for="selection in state.difficultySelections"
          :value="selection.level"
          :key="selection.level"
          >{{ selection.level }} ({{ selection.cardsCount }} cards)</option
        >
      </select>
      <div>
        <button type="submit" :disabled="state.disableGameSettings">Play</button>
      </div>
    </form>
    <div class="result" :class="getResultClass(state)">
      <span>
        {{ state.isWin ? 'Congrats! You did it' : 'You failed!' }}
      </span>
      <button @click="handleStartOver">
        Start over
      </button>
    </div>
    <div class="card-grid">
      <template v-for="(card, index) in state.cards">
        <div :key="card.value" @click="handleFlipCard(index)" :class="getCardClass(card)">
          {{ card.value }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropValidator } from 'vue/types/options';
import { HydratedState, Card } from '../../presenters/cards-game-presenter';
import { DifficultyLevel } from '../../../../backend/src/models/game-card';

const events = {
  flipCard: 'flip-card',
  play: 'play',
  selectDifficulty: 'select-difficulty',
  startOver: 'start-over',
};
export default Vue.extend({
  name: 'HydratedState',
  props: {
    state: {
      type: Object,
      required: true,
    } as PropValidator<HydratedState>,
  },
  methods: {
    handleDifficultySelection(event: Event): void {
      const element = event.target as HTMLSelectElement;
      const parsedValue = Number(element.value) as DifficultyLevel;
      this.$emit(events.selectDifficulty, parsedValue);
    },
    handleStartOver(): void {
      this.$emit(events.startOver);
    },
    handleFlipCard(index: number): void {
      this.$emit(events.flipCard, index);
    },
    handlePlay(): void {
      this.$emit(events.play);
    },
    getCardClass(card: Card): Record<string, boolean> {
      return {
        card: true,
        covered: card.covered,
      };
    },
    getResultClass(state: HydratedState): Record<string, boolean> {
      return {
        result: true,
        hidden: state.hideGameResult,
      };
    },
  },
});
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > * + * {
    margin-top: 20px;
  }
  button {
    min-width: 60px;
    padding: 12px;
    background-color: #000000;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:disabled {
      background-color: #aaaaaa;
      cursor: unset;
    }
  }
  .settings {
    display: flex;
    align-items: center;
    & > * + * {
      margin-inline-start: 10px;
      margin-inline-end: 10px;
    }
    select {
      min-width: 60px;
      padding: 12px;
    }
  }
  .result {
    transition: opacity 0.8s;
    display: flex;
    align-items: center;
    & > * + * {
      margin-inline-start: 10px;
      margin-inline-end: 10px;
    }
    &.hidden {
      opacity: 0;
      visibility: hidden;
    }
  }
  .card-grid {
    display: grid;
    place-items: center;
    grid-gap: 16px;
    grid-template-columns: repeat(4, 120px);
    grid-template-rows: repeat(3, 160px);
    .card {
      display: grid;
      place-items: center;
      font-size: xx-large;
      border: 1px solid #9a9a9a;
      border-radius: 4px;
      width: 100%;
      height: 100%;
      transition: transform 0.6s, color 0.2s step-end;
      transform-style: preserve-3d;
    }
    .covered {
      cursor: pointer;
      background-color: #eaeaea;
      transform: scaleX(-1);
      color: transparent;
    }
  }
}
</style>
