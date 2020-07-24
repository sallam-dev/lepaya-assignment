<template>
  <div class="container">
    <form class="settings" @submit.prevent="presenter.play()">
      <label for="difficulty-level">Select difficulty level: </label>
      <select
        @input="handleDifficultyChange"
        id="difficulty-level"
        :disabled="presenter.state.disableGameSettings"
        :value="presenter.state.difficultyLevel"
        name="difficulty-level"
        required
      >
        <option v-for="value in presenter.state.allowedDifficultyLevels" :value="value" :key="value"
          >{{ value }} ({{ value * 4 }} cards)</option
        >
      </select>
      <div>
        <button type="submit" :disabled="presenter.state.disableGameSettings">Play</button>
      </div>
    </form>
    <div class="result" :class="getResultClass(presenter.state)">
      <span>
        {{ presenter.state.isWin ? "Congrats! You did it" : "You failed!" }}
      </span>
      <button @click="presenter.playAgain()">
        Play Again
      </button>
    </div>
    <div class="card-grid">
      <template v-for="(card, index) in presenter.state.cards">
        <div :key="card.value" @click="presenter.flipCard(index)" :class="getCardClass(card)">
          {{ card.value }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CardsGamePresenter, DifficultyLevel } from "@/presenters/CardsGamePresenter";
import { Card, GameCardState } from "../../presenters/CardsGamePresenter";

export default Vue.extend({
  name: "CardsGame",
  data() {
    return {
      presenter: new CardsGamePresenter()
    };
  },
  methods: {
    handleDifficultyChange(event: Event): void {
      const element = event.target as HTMLSelectElement;
      const parsedValue = Number(element.value) as DifficultyLevel;
      this.presenter.selectDifficultyLevel(parsedValue);
    },
    getCardClass(card: Card): Record<string, boolean> {
      return {
        card: true,
        covered: card.covered
      };
    },
    getResultClass(state: GameCardState): Record<string, boolean> {
      return {
        result: true,
        hidden: state.hideGameResult
      }
    }
  }
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
