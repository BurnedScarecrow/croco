import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast from "vue-toastification";
import VueSocketIO from "vue-socket.io";

// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

Vue.use(Toast);
Vue.use(
  new VueSocketIO({
    debug: false,
    // connection: "http://192.168.43.134:5000",
    // connection: "http://192.168.43.90:5000",
    connection: "http://3.14.151.80/",
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
    // options: { path: "/my-app/" } //Optional options
  })
);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
