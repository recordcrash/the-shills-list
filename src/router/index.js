import Vue from 'vue';
import VueRouter from 'vue-router';
import ShillsList from '../views/ShillsList.vue';
import Profile from '../views/Profile.vue';
import Leaderboard from '../views/Leaderboard.vue';
import About from '../views/About.vue';
import Home from '../views/Home.vue';
import Stats from '../views/Stats.vue';
import ShillView from '../views/ShillView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/list/',
    name: 'ShillsListMain',
    component: ShillsList,
    meta: {
      title: 'The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
        {
          property: 'og:description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
      ],
    },
  },
  {
    path: '/list/:tag',
    name: 'ShillsListTagged',
    component: ShillsList,
    meta: {
      title: 'The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
        {
          property: 'og:description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
      ],
    },
  },
  {
    path: '/shill/:id',
    name: 'ShillView',
    component: ShillView,
  },
  {
    path: '/shill/:id/:name',
    name: 'ShillViewNamed',
    component: ShillView,
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard,
    meta: {
      title: 'Leaderboard - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'A dynamic leaderboard that tracks people\'s progress in the Shills List.',
        },
        {
          property: 'og:description',
          content: 'A dynamic leaderboard that tracks people\'s progress in the Shills List.',
        },
      ],
    },
  },
  {
    path: '/profile/:username?',
    name: 'profile',
    component: Profile,
    meta: {
      title: 'User Profile - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'The profile of a Shills List user.',
        },
        {
          property: 'og:description',
          content: 'The profile of a Shills List user.',
        },
      ],
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'About Page - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'An explanation of what the Shills List is, as well as the conditions to add your own shills.',
        },
        {
          property: 'og:description',
          content: 'An explanation of what the Shills List is, as well as the conditions to add your own shills.',
        },
      ],
    },
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
        {
          property: 'og:description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
      ],
    },
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats,
    meta: {
      title: 'Stats - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'Stats regarding the Shills list and the people who read them.',
        },
        {
          property: 'og:description',
          content: 'Stats regarding the Shills list and the people who read them.',
        },
      ],
    },
  },
  {
    path: '/blog',
    // eslint-disable-next-line no-restricted-globals
    beforeEnter() { window.open('https://recordcrash.substack.com/'); },
  },
  {
    path: '/twitter',
    // eslint-disable-next-line no-restricted-globals
    beforeEnter() { window.open('https://twitter.com/recordcrash'); },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find((r) => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched.slice().reverse().find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el) => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map((tagDef) => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach((key) => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

export default router;
