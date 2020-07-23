<template>
  <div class="container">
    <template v-for="card in presenter.state.cards" >
      <div class="card" :key="card.value">
        <span v-if="card.state != 'BLANK_SIDE'"  >
          {{card.value}}
        </span>

      </div>
    </template>
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
  display: grid;
  place-items: center;
  .card {
    border: #9a9a9a;
    border-radius: 4px;
  }
}
</style>
