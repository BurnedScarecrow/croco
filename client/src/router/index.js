import Vue from "vue";
// import Vuex from "vuex";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);
// Vue.use(Vuex)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/play",
    name: "Play",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Play.vue")
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

export default router;
