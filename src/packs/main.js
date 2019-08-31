import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Rollbar from 'vue-rollbar';
import { Loading } from 'element-ui';
import Home from '@/views/Home.vue';
import '@/plugins/element.js';
import '@/stylesheets/global.scss';
import '@/stylesheets/tailwind.css';

import router from '@/router';

Vue.config.productionTip = false;

Vue.use(Loading);
Vue.use(VueAnalytics, {
  id: 'UA-145065333-1',
  router,
});
Vue.use(Rollbar, {
  accessToken: process.env.ROLLBAR_CLIENT_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: true,
  environment: process.env.NODE_ENV,
  payload: {
    client: {
      javascript: {
        code_version: '1.0',
        source_map_enabled: true,
        guess_uncaught_frames: true,
      },
    },
  },
});

new Vue({
  router,
  render: h => h(Home),
}).$mount('#app');
