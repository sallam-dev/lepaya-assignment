import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import CardsGame from '@/ui/cards-game/CardsGame.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'CardsGame',
    component: CardsGame,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
