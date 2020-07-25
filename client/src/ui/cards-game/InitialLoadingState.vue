<template>
  <div class="container">
    Loading...
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'InitialLoadingState',
});
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: xx-large;
}
</style>
