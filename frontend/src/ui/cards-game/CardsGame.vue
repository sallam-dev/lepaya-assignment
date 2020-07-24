<template>
  <div class="container">
    <form class="game-settings" @submit.prevent="presenter.play()">
      <label for="difficulty-level">Select difficulty level:
        <select @input="handleDifficultyChange" id="difficulty-level" :disabled="presenter.state.type != 'INITIAL'" :value="presenter.state.difficultyLevel" name="difficulty-level" required>
          <option v-for="value in presenter.state.allowedDifficultyLevels" :value="value" :key="value">{{value}} ({{value * 4}} cards)</option>
        </select>
      </label>
      <button type="submit">Play</button>
    </form>
    <div class="card-grid">
      <template v-for="card in presenter.state.cards" >
        <div class="card" :key="card.value">
        <span v-if="card.state != 'BLANK_SIDE'"  >
          {{card.value}}
        </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { CardsGamePresenter, DifficultyLevel } from '@/presenters/CardsGamePresenter';

export default Vue.extend({
  name: 'CardsGame',
  data() {
    return {
      presenter: new CardsGamePresenter(),
    };
  },
  methods: {
    handleDifficultyChange(event: Event): void {
      const element = event.target as HTMLSelectElement;
      const parsedValue = Number(element.value) as DifficultyLevel;
      this.presenter.selectDifficultyLevel(parsedValue);
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
  .game-settings {
    select {
      min-width: 50px;
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
    }
  }

}
</style>
