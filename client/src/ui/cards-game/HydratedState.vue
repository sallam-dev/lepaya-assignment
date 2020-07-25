<template>
  <main>
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
      <div class="result" :class="resultClasses">
        <span>
          {{ state.isWin ? 'Congrats! You did it' : 'You failed!' }}
        </span>
        <button @click="handleStartOver">
          Start over
        </button>
      </div>
      <div class="game-container">
        <div class="card-grid">
          <template v-for="(card, index) in state.cards">
            <div :key="card.value" @click="handleFlipCard(index)" :class="getCardClasses(card)">
              {{ card.value }}
            </div>
          </template>
        </div>
        <div class="user-solution">
          Your moves:
          <ol>
            <li v-for="move in state.userSolution" :key="move">
              {{ move }}
            </li>
          </ol>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropValidator } from 'vue/types/options';
import { HydratedState, Card } from '../../presenters/cards-game-presenter';
import { DifficultyLevel } from '../../models/cards-game';

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
  computed: {
    resultClasses(): Record<string, boolean> {
      return {
        result: true,
        hidden: this.state.hideGameResult,
      };
    },
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
    getCardClasses(card: Card): Record<string, boolean> {
      return {
        card: true,
        covered: card.covered,
      };
    },
  },
});
</script>

<style scoped lang="scss">
main {
  width: 100%;
  display: flex;
  justify-content: center;
}
.container {
  padding: 20px;
  display: flex;
  width: fit-content;
  flex-direction: column;
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
      margin-inline-start: 20px;
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
      margin-inline-start: 20px;
    }
    &.hidden {
      opacity: 0;
      visibility: hidden;
    }
  }
  .game-container {
    display: grid;
    grid-gap: 20px;
    @media only screen and (max-width: 768px) {
      & {
        grid-template-columns: 1fr;
      }
    }
    @media only screen and (min-width: 768px) {
      & {
        grid-template-columns: 1fr auto;
      }
    }
    width: fit-content;
    .card-grid {
      display: grid;
      place-items: center;
      grid-gap: 16px;
      grid-template-columns: repeat(4, 120px);
      grid-auto-rows: 160px;
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
    .user-solution {
      border: 1px solid #9a9a9a;
      border-radius: 4px;
      padding: 8px;
      min-width: 150px;
      ol {
        margin-top: 8px;

        padding: 0;
        list-style-type: none;
        counter-increment: customlistcounter;
        & > * + * {
          margin-top: 8px;
        }
        li {
          counter-increment: customlistcounter;
        }
        li::before {
          content: counter(customlistcounter) '-  ';
        }
        li:first-child {
          counter-reset: customlistcounter;
        }
      }
    }
  }
}
</style>
