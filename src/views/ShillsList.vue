<template>
  <div class="shills-list">
    <v-row class="filters pa-2">
      <v-col>
        <v-autocomplete label="Show only"
          v-model="includedTags" :items="allTags"
          outlined dense chips hide-details small-chips deletable-chips multiple/>
      </v-col>
      <v-col>
        <v-autocomplete label="Exclude"
          v-model="excludedTags" :items="allTags"
          outlined dense hide-details chips small-chips deletable-chips multiple/>
      </v-col>
      <v-col>
         <v-select label="Sort by"
          v-model="sortedBy" :items="sortings"
          outlined hide-details dense/>
      </v-col>
      <v-col>
         <v-select label="Completion status"
          v-model="show" :items="showings"
          outlined hide-details dense/>
      </v-col>
    </v-row>
    <div class="shills">
    <v-layout row wrap justify-center class="pb-3">
      <shill-card v-for="shill in shownShills" v-bind:key="shill.id" :isAuthenticated="isAuthenticated" :maxWidth="375" class="ma-2"
      :work="shill"
      :reads="reads"
      :likes="likes"
      @tag="onTag"/>
    </v-layout>
    </div>
  </div>
</template>

<script>
import ShillCard from '../components/ShillCard.vue';
import api from '../auth/api';
import Shill from '../models/shill';
import WilsonScore from '../helpers/wilsonScore';

export default {
  name: 'ShillsList',
  props: {
    type: String,
  },
  components: {
    ShillCard,
  },
  computed: {
    isAuthenticated() {
      return this.$auth.isAuthenticated;
    },
    sortedShillsList() {
      if (this.shills === []) return [];
      switch (this.sortedBy) {
        case 'Best':
          return [...this.shills].sort((a, b) => WilsonScore.lowerBound(b.likes, b.readers) - WilsonScore.lowerBound(a.likes, a.readers));
        case 'Likes':
          return [...this.shills].sort((a, b) => b.likes - a.likes);
        case 'Readers':
          return [...this.shills].sort((a, b) => b.readers - a.readers);
        case 'Alphabetical':
          return [...this.shills].sort((a, b) => a.name.localeCompare(b.name));
        case 'Time investment':
          return [...this.shills].sort((a, b) => b.hours - a.hours);
        case 'Recommended':
        default:
          return this.shills;
      }
    },
    filteredShills() {
      return this.sortedShillsList.filter(
        (shill) => this.includedTags.every((selTag) => shill.tags.includes(selTag))
          && !this.excludedTags.some((selTag) => shill.tags.includes(selTag)),
      );
    },
    shownShills() {
      switch (this.show) {
        case 'Completed':
          return this.filteredShills.filter((el) => this.shillIsRead(el.id));
        case 'Uncompleted':
          return this.filteredShills.filter((el) => !this.shillIsRead(el.id));
        default:
          return this.filteredShills;
      }
    },
    allTags() {
      const allTags = new Set();
      if (this.shills === []) return [];
      this.shills.forEach((shill) => shill.tags.forEach((tag) => allTags.add(tag)));
      return Array.from(allTags);
    },
  },
  methods: {
    onTag(tag) {
      this.includedTags = [tag];
    },
    shillIsRead(id) {
      return !!this.reads.find((el) => el.readername === this.$auth?.user?.name && el.work === id);
    },
    processRoute() {
      if (this.$route.params.tag) {
        const { tag } = this.$route.params;
        const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        switch (tag) {
          case 'all':
            this.includedTags = [];
            this.excludedTags = ['Flawed', 'Main', 'Custom'];
            break;
          case 'custom':
            this.includedTags = ['Custom'];
            this.excludedTags = ['Drewshills', 'Kidpenshills'];
            break;
          case 'drewshills':
            this.includedTags = ['Drewshills'];
            this.excludedTags = [];
            break;
          case 'kidpenshills':
            this.includedTags = ['Kidpenshills'];
            this.excludedTags = [];
            break;
          default:
            this.includedTags = [capitalizedTag];
            this.excludedTags = ['Custom'];
        }
      }
    },
  },
  async mounted() {
    // Load list of works and set up filters
    const works = await api.requestShillsList({ auth: this.$auth, type: this.type });
    this.shills = Shill.toInstanceList(works);
    this.processRoute();

    // Load reads and likes for heart/flag management
    const promises = await Promise.all([
      await api.requestAllWorksRead(),
      await api.requestAllWorksLiked(),
    ]);
    [this.reads, this.likes] = promises;
    this.readers = await api.requestReaders({ auth: this.$auth });
    this.shills.forEach((el) => { console.log(WilsonScore.lowerBound(el.readerss, el.likes)); });
  },
  data() {
    return {
      readers: [],
      shills: [],
      reads: [],
      likes: [],
      showUnread: false,
      includedTags: ['Main'],
      excludedTags: ['Flawed', 'Custom'],
      sortings: ['Recommended', 'Best', 'Likes', 'Readers', 'Alphabetical', 'Time investment'],
      sortedBy: 'Recommended',
      show: 'All',
      showings: ['All', 'Uncompleted', 'Completed'],
    };
  },
  watch: {
    // eslint-disable-next-line func-names
    '$route.params.tag': function () {
      this.processRoute();
    },
  },
};
</script>
