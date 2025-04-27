import Vue from 'vue';
import TrendChart from 'vue-trend-chart';
import VueMeta from 'vue-meta';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

// Auth0 stuff
import { domain, clientId, audience } from '../auth_config.json';
import { Auth0Plugin } from './auth';

Vue.config.productionTip = false;

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  },
});

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

Vue.use(TrendChart);

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');
