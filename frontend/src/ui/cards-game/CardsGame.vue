<template>
  <div class="container">
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
import CardsGamePresenter from '@/presenters/CardsGamePresenter';

export default Vue.extend({
  name: 'CardsGame',
  data() {
    return {
      presenter: new CardsGamePresenter(),
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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
