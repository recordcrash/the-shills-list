import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  options: {
    customProperties: true,
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#1E90FF',
        secondary: '#17202A',
        accent: '#1E90FF',
        error: '#B22222',
      },
    },
  },
});
