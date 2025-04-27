<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app clipped style="z-index: 999 !important;">
        <v-list dense>
          <v-list-item v-for="item in items" :key="item.text" :to="item.to">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app clipped-left color="secondary" dense>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-toolbar-title class="align-center">
          <router-link
            style="text-decoration: none; color: inherit;" to="/">
            <span class="title">The Shills List</span>
          </router-link>
        </v-toolbar-title>
        <v-spacer />
        <router-link v-if="$auth.isAuthenticated" :to="`/profile/${$auth.user.name ? $auth.user.name.replace(/ /g, '+') : ''}`"
          >{{ $auth.user.name }}</router-link
        >
        <div class="mx-3" v-if="!$auth.loading">
          <!-- show login when not authenticated -->
          <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>
          <!-- show logout when authenticated -->
          <button v-if="$auth.isAuthenticated" @click="logout">
            Log out
          </button>
        </div>
      </v-app-bar>

      <v-main  style="overflow: hidden;">
        <router-view v-if="$auth" />
      </v-main>
    </v-app>
  </div>
</template>

<script>

export default {
  name: 'App',
  props: {
    source: String,
  },

  components: {},

  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },

  data: () => ({
    drawer: null,
    items: [
      { icon: 'mdi-chart-bar', text: 'Home', to: '/' },
      { icon: 'mdi-library', text: 'Main Shills', to: '/list/main' },
      { icon: 'mdi-book', text: 'More Shills', to: '/list/all' },
      { icon: 'mdi-weather-lightning', text: 'Flawed Shills', to: '/list/flawed' },
      { icon: 'mdi-trophy-award', text: 'Custom Shills', to: '/list/custom' },
      { icon: 'mdi-baguette', text: 'Drew\'s Shills', to: '/list/drewshills' },
      { icon: 'mdi-mustache', text: 'Kidpen\'s Shills', to: '/list/kidpenshills' },
      { icon: 'mdi-medal-outline', text: 'Leaderboard', to: '/leaderboard' },
      { icon: 'mdi-trending-up', text: 'Stats', to: '/stats' },
      { icon: 'mdi-fountain-pen-tip', text: 'Blog', to: '/blog' },
      { icon: 'mdi-twitter', text: 'Twitter', to: '/twitter' },
      { icon: 'mdi-comment-question', text: 'About', to: '/about' },
    ],
  }),
};
</script>
