<template>
  <v-card elevation="24" :max-width="maxWidth" :min-width="minWidth" style="display: flex; flex-direction: column;">
    <v-carousel
      :continuous="true" :cycle="false" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus"
      :hide-delimiters="work.hasSingleImage()"
      height="300">
      <v-carousel-item v-for="(image, index) in work.image" :key="index">
        <router-link :to="'/shill/'+work.id+'/'+work.name.replace(/ /g, '+')">
        <v-img :src="image" :gradient="work.cardGradient()" height="300">
          <v-card-title lights-out style="text-shadow: 0 0 2px #000, 0 0 3px #000, 0 0 4px #000;">{{work.name}}</v-card-title>
          <v-card-subtitle style="color: #fff; text-shadow: 0 0 1px #000, 0 0 2px #000">{{work.author}}</v-card-subtitle>
        </v-img>
        </router-link>
      </v-carousel-item>
    </v-carousel>
    <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <v-card-text><div v-html="work.description"></div></v-card-text>
    <v-card-actions style="align-items: end; display: flex; flex-grow: 1;">
      <v-container class="mb-0 pl-1 pb-1 align-self-end">
        <v-slide-group multiple>
          <v-slide-item v-for="tag in work.tags" :key="tag">
            <v-chip class="mr-1" @click="onClickTag(tag)">{{tag}}</v-chip>
          </v-slide-item>
        </v-slide-group>
       <v-list-item class="grow">
        <v-row justify="start">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
              <v-icon class="mr-1" v-if="!isAuthenticated" @click="onLike(work.id)"> mdi-heart-outline </v-icon>
              <v-icon class="mr-1" v-else-if="isAuthenticated && !localLiked" @click="onLike(work.id)"> mdi-heart-outline </v-icon>
              <v-icon class="mr-1" v-else @click="onLike(work.id)"> mdi-heart </v-icon>
              <span class="subheading mr-2">{{localLikes}}</span>
              </div>
           </template>
            <span>{{likedTooltip}}</span>
          </v-tooltip>
          <span class="mr-1">·</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
            <v-icon class="mr-1" v-if="!isAuthenticated" @click="onRead(work.id)"> mdi-flag-outline </v-icon>
            <v-icon class="mr-1" v-else-if="isAuthenticated && !localRead" @click="onRead(work.id)"> mdi-flag-outline </v-icon>
            <v-icon class="mr-1" v-else @click="onRead(work.id)"> mdi-flag </v-icon>
            <span class="subheading mr-2">{{localReads}}</span>
            </div>
            </template>
            <span>{{readTooltip}}</span>
          </v-tooltip>
          <span class="mr-1">·</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-icon class="mr-1"> mdi-clock </v-icon>
                <span class="subheading" >{{work.timeString()}}</span>
              </div>
            </template>
            <span>{{work.amount}}</span>
          </v-tooltip>
          <v-spacer/>
          <a :href="work.link" target="_blank">{{work.linkText}}</a>
        </v-row>
      </v-list-item>
      </v-container>
    </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import api from '../auth/api';
import Shill from '../models/shill';

export default {
  props: {
    isAuthenticated: Boolean,
    work: Shill,
    maxWidth: Number,
    minWidth: Number,
    reads: Array,
    likes: Array,
  },
  methods: {
    onClickTag(tag) {
      this.$emit('tag', tag);
    },
    async onLike(id) {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else if (!this.localLiked) {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.likeWork(id, readername);
          }
        } finally {
          this.localLikes += 1;
          this.localLiked = true;
          document.activeElement.blur();
        }
      } else {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.likeWork(id, readername);
          }
        } finally {
          this.localLikes -= 1;
          this.localLiked = false;
          document.activeElement.blur();
        }
      }
    },
    async onRead(id) {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else if (!this.localRead) {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.readWork(id, readername);
          }
        } finally {
          this.localReads += 1;
          this.localRead = true;
          document.activeElement.blur();
        }
      } else {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.readWork(id, readername);
          }
        } finally {
          this.localReads -= 1;
          this.localRead = false;
          document.activeElement.blur();
        }
      }
    },
  },
  computed: {
    likedTooltip() {
      return `${this.localLikes} people have enjoyed this work`;
    },
    readTooltip() {
      return `${this.localReads} people have finished this work`;
    },
    isRead() {
      return !!this.reads.find((el) => el.readername === this.$auth?.user?.name && el.work === this.work.id);
    },
    isLiked() {
      return !!this.likes.find((el) => el.readername === this.$auth?.user?.name && el.work === this.work.id);
    },
  },
  mounted() {
    this.localLikes = this.work.likes;
    this.localReads = this.work.readers;
    this.localLiked = this.isLiked;
    this.localRead = this.isRead;
  },
  data() {
    return {
      localLikes: 0,
      localReads: 0,
      localLiked: false,
      localRead: false,
    };
  },
  watch: {
    isLiked(newLiked) {
      this.localLiked = newLiked;
    },
    isRead(newRead) {
      this.localRead = newRead;
    },
  },
};
</script>

<style>
.v-card__text, .v-card__title {
  word-break: normal !important;
  }

.v-slide-group__next, .v-slide-group__prev{
  min-width: 0px !important;
  flex: none !important;
}
.spoiler{
  color: black;
  background-color:black;
}

.spoiler:hover{
  color: white;
}
</style>

<style scoped>
a {text-decoration: none; }
</style>
