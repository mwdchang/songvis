import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

const app = createApp(App);

// Vue3 doesn't have "filters"
app.config.globalProperties.$filters = {
  test(value) {
    return '>>' + value + '<<';
  }
};

app.use(store).mount('#app');
