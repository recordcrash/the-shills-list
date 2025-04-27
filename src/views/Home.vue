<template>
  <div class="statsList">
    <div class="d-flex flex-row justify-center pt-3 pb-0"><h2>WELCOME TO <router-link to="/list/main">THE SHILLS LIST</router-link></h2></div>
    <div class="d-flex flex-row justify-center pb-3 subtitle"><small>Click on the link above to go straight to the list itself</small></div>
    <div class="d-flex flex-row flex-wrap justify-center mx-6">
      <div class="justify-center">
        <v-row justify="center">
          <v-col class="latestReviews">
            <v-card-title class="pb-0">LATEST REVIEWS</v-card-title>
            <div v-if="latestReviews">
              <div v-for="(review, index) in latestReviews" :key="index">
                  <v-card-title class="pb-0"><span class="review-pretext"><router-link :to="getWorkUrl(review.workid)">{{getWorkName({work: review.workid})}}</router-link></span></v-card-title>
                  <router-link :to="getReaderUrl(review.readername)"><v-card-subtitle class="pt-0 font-italic">{{review.readername}}</v-card-subtitle></router-link>
                  <v-card-text class="py-0"><span class="review">{{review.review}}</span></v-card-text>
              </div>
            </div>
          </v-col>
          <!-- Sadly removed since mid 2023 due to Twitter API changes
          <v-col class="latestTweets">
            <v-card-title class="pb-0">LATEST TWEETS</v-card-title>
            <div class="tweetList" v-if="tweets">
              <div v-for="(tweet, index) in tweets" :key="index">
                <div class="tweet">
                  <v-card-text class="py-0"><span class="tweetText"><a href="https://twitter.com/RecordCrash" target="_blank">@RecordCrash</a>: {{tweet.text}}</span></v-card-text>
                  <div class="storyContainer" v-if="tweet.url">
                    <v-card-text v-if="tweet.storyTitle" class="pb-0"><a :href="tweet.url ? tweet.url : null" target="_blank">{{tweet.storyTitle}}</a></v-card-text>
                    <v-card-subtitle v-if="tweet.storyText" class="pt-0 font-italic">{{tweet.storyText}}</v-card-subtitle>
                  </div>
                  <v-divider></v-divider>
                </div>
              </div>
            </div>
          </v-col> -->
          <v-col v-if="latestCompletions" class="latestCompletions">
            <v-card-title class="pb-0">LATEST ACTIVITY</v-card-title>
            <div v-if="latestCompletions">
              <v-list-item two-line v-for="(completion, index) in latestCompletions" :key="index">
                <v-list-item-content>
                  <router-link :to="completion.link"><v-list-item-title>{{completion.readername}}</v-list-item-title></router-link>
                  <v-list-item-subtitle class="completion-work-list">{{completion.works}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

  </div>
</template>

<script>
import api from '../auth/api';

export default {
  name: 'Home',
  components: { },
  data() {
    return {
      data: null,
      works: [],
      // tweets: [],
      reads: [],
      rawReads: [],
      reviews: [],
    };
  },
  computed: {
    latestReviews() {
      return [...this.reviews].filter((review) => review.review.length > 20).reverse().slice(0, 10);
    },
    latestCompletions() {
      const latestCompletions = [];
      let lastReaderName = null;
      let currentCompletion = null;
      [...this.rawReads].reverse().forEach((completion) => {
        // If it's not the same reader, start new array
        const workName = this.getWorkName({ work: completion.work });
        const readerName = completion.readername;
        const workReaderLink = this.getReaderUrl(readerName);
        if (lastReaderName !== readerName) {
          // If we have a finished object, push into the final array
          if (currentCompletion) latestCompletions.push(currentCompletion);
          currentCompletion = {
            works: workName,
            readername: readerName,
            link: workReaderLink,
          };
        } else { // If it's the same reader, add it to its array
          currentCompletion.works += `, ${workName}`;
        }
        lastReaderName = readerName;
      });
      return latestCompletions.slice(0, 30);
    },
    readArray() {
      const readArray = [];
      this.rawReads.forEach((el) => {
        const found = readArray.find((read) => read.readername === el.readername);
        if (!found) {
          const element = { readername: el.readername, value: 1, hours: this.works.find((work) => work.id === el.work).hours };
          readArray.push(element);
        } else {
          found.value += 1;
          found.hours += this.works.find((work) => work.id === el.work).hours;
        }
      });
      return readArray;
    },
  },
  methods: {
    numberWithSpaces(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    onMouseMove(params) {
      if (!params) {
        this.currentInfo = null;
        return;
      }
      this.currentInfo = {
        label: params.data[0].day,
        value: this.numberWithSpaces(params.data[0].value),
      };
    },
    convertDate(dateString) {
      let dateObject = new Date(dateString);
      const offset = dateObject.getTimezoneOffset();
      dateObject = new Date(dateObject.getTime() - (offset * 60 * 1000));
      return dateObject.toISOString().split('T')[0];
    },
    getWorkName(work) {
      return this.works.find((el) => el.id === work.work)?.name;
    },
    getWorkUrl(id) {
      return `/shill/${id}/${this.works.find((el) => el.id === id)?.name.replace(/ /g, '+')}`;
    },
    getReaderUrl(readername) {
      return `/profile/${readername.replace(/ /g, '+')}`;
    },
    addTime(read) {
      const found = this.works.find((el) => el.id === read.work);
      this.hoursWasted += found && found.hours ? found.hours : 0;
    },
    prepareReadsArray(reads) {
      const dataArray = [];
      reads.filter((el) => el.readername != null).forEach((el) => {
        this.addTime(el);
        if (dataArray[el.work]) {
          const foundDate = dataArray[el.work].data.find((date) => date.day === this.convertDate(el.created));
          if (foundDate) {
            foundDate.value += 1;
          } else {
            const element = { day: this.convertDate(el.created), value: 1 };
            dataArray[el.work].data.push(element);
          }
        } else {
          const element = { day: this.convertDate(el.created), value: 1 };
          dataArray[el.work] = {};
          dataArray[el.work].data = [element];
          dataArray[el.work].slug = this.getWorkName(el);
        }
      });
      return dataArray;
    },
  },
  async mounted() {
    const promises = await Promise.all([
      await api.requestShillsList({ auth: this.$auth, type: this.type }),
      await api.requestAllWorksRead(),
      // await api.requestTweets(),
    ]);
    const [works, reads/*, tweets */] = promises;
    this.works = works;
    // this.tweets = tweets;
    this.reads = this.prepareReadsArray(reads);
    this.rawReads = reads;
    this.reviews = await api.requestAllReviews();
  },
};
</script>

<style lang="scss" scoped>
a {text-decoration: none; }
.completion-work-list {
  white-space: normal;
}
.review {
  white-space: pre-wrap;
  line-height: 1.6;
}
.tweet {
  margin-top: 10px;
}
.storyContainer{
  border-radius: 5px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  margin: 10px;
}
</style>
