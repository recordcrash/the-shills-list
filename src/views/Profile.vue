<template>
<v-container>
  <div>
    <div>
      <h2>{{ username }}</h2>
        <p><b>Completion count</b>: {{ worksReadString }}
        <p><b>Hours read</b>: {{ hoursLeftString }}
        <p><b>Medals</b>:</p>
        <p><ul>
          <li v-for="medal in medals" :key="medal.name">
            <img :src="medal.link" :title="medal.description"/> {{medal.name}}
          </li>
          </ul>
        </p>
        <v-row>
        <v-col><b>Shills finished</b>:
        <ul>
          <li v-for="read in reads" :key="read.name">
            <router-link :to="'/shill/'+read.id+'/'+read.name.replace(/ /g, '+')">
               {{read.name}}
            </router-link>
          </li>
        </ul>
        </v-col>
        <v-col><b>Shills liked</b>:
        <ul>
          <li v-for="like in likes" :key="like.name">
            <router-link :to="'/shill/'+like.id+'/'+like.name.replace(/ /g, '+')">
              {{like.name}}
            </router-link>
          </li>
        </ul>
        </v-col>
        </v-row>
        <v-card-title class="pb-0">Reviews by {{username}}</v-card-title>
        <div style="display: flex; flex-direction: column; flex-grow: 1;" class="">
          <div v-for="review in sortedReviews" :key="review.id">
            <router-link :to="'/shill/'+review.workid+'/'+getWorkName(review.workid).replace(/ /g, '+')"><v-card-title class="pb-0 mb-0">{{getWorkName(review.workid)}}</v-card-title></router-link>
            <v-card-text><span class="review">{{review.review}}</span></v-card-text>

          </div>
        </div>
    </div>
  </div>
</v-container>
</template>

<script>
import api from '../auth/api';

export default {
  name: 'Profile',
  computed: {
    sortedReviews() {
      return [...this.reviews].reverse();
    },
    worksReadString() {
      return `${this.numberRead}/${this.totalWorks}`;
    },
    worksLikedString() {
      return `${this.numberLiked}/${this.totalWorks}`;
    },
    hoursLeftString() {
      return `${this.hoursRead}/${this.totalHours}`;
    },
    numberRead() {
      return this.reads.length;
    },
    hoursRead() {
      return this.reads.reduce((prev, cur) => prev + cur.hours, 0);
    },
    numberLiked() {
      return this.reads.length;
    },
    totalWorks() {
      return this.works.length;
    },
    totalHours() {
      return this.works.reduce((prev, cur) => prev + cur.hours, 0);
    },
    medals() {
      const medals = [];
      const goldMedal = { name: 'Gold Medal', link: '/images/gold.png', description: 'A medal granted to those who finish the main shills list' };
      const silverMedal = { name: 'Silver Medal', link: '/images/silver.png', description: 'A medal granted to those who finish over ten shills' };
      const gameMedal = { name: 'Game Medal', link: '/images/game.png', description: 'A medal granted to those who finish all the games in the shills list' };
      const tvMedal = { name: 'Video Medal', link: '/images/tv.png', description: 'A medal granted to those who finish all the video shills' };
      const bookMedal = { name: 'Book Medal', link: '/images/book.png', description: 'A medal granted to those who finish the additional shills' };
      const huskyMedal = { name: 'Husky Medal', link: '/images/husky.png', description: 'A medal granted to those who read one shill of every list, even custom' };
      const goldMedalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
      const gameMedalArray = [30, 31, 32];
      const tvMedalArray = [33, 34];
      const bookMedalArray = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
      const localReads = this.readInts;
      if (goldMedalArray.every((el) => localReads.includes(el))) medals.push(goldMedal);
      if (localReads.length > 10) medals.push(silverMedal);
      if (gameMedalArray.every((el) => localReads.includes(el))) medals.push(gameMedal);
      if (tvMedalArray.every((el) => localReads.includes(el))) medals.push(tvMedal);
      if (bookMedalArray.every((el) => localReads.includes(el))) medals.push(bookMedal);
      if (
        this.readWorks.some((el) => el.tags.includes('Main'))
        && this.readWorks.some((el) => el.tags.includes('Custom'))
        && this.readWorks.some((el) => el.tags.includes('Flawed'))
        && this.readWorks.some((el) => !el.tags.includes('Main') && !el.tags.includes('Flawed') && !el.tags.includes('Custom'))
      ) medals.push(huskyMedal);
      return medals;
    },
  },
  methods: {
    getWorkName(id) {
      return this.works.find((work) => work.id === id).name;
    },
  },
  async mounted() {
    this.username = this.$route.params.username ? this.$route.params.username.replace(/\+/g, ' ') : this.$auth.user.name || 'Makin';
    document.title = this.username ? `${this.username} - The Shills List` : 'User Profile - The Shills List';
    const promises = await Promise.all([
      await api.requestShillsList(),
      await api.requestAllWorksRead(),
      await api.requestAllWorksLiked(),
      await api.requestReviewsByReader(this.username),
    ]);
    const works = promises[0];
    let readInts = promises[1];
    let likeInts = promises[2];
    const reviews = promises[3];
    readInts = readInts.filter((read) => read.readername === this.username).map((el) => el.work);
    likeInts = likeInts.filter((like) => like.readername === this.username).map((el) => el.work);
    const readWorks = works.filter((work) => readInts.includes(work.id));
    this.works = works;
    this.reads = works.filter((work) => readInts.includes(work.id)).map((work) => ({
      name: work.name, link: work.link, hours: work.hours, id: work.id,
    }));
    this.likes = works.filter((work) => likeInts.includes(work.id)).map((work) => ({
      name: work.name, link: work.link, hours: work.hours, id: work.id,
    }));
    this.readInts = readInts;
    this.likeInts = likeInts;
    this.readWorks = readWorks;
    this.reviews = reviews;
  },
  data() {
    return {
      works: [],
      reads: [],
      likes: [],
      readInts: [],
      likeInts: [],
      readWorks: [],
      reviews: [],
      username: '',
    };
  },
};
</script>

<style scoped>
.review {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
