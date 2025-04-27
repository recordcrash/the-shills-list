<template>
<v-container>
<div v-if="work">
  <v-card elevation="24" style="display: flex; flex-direction: column;">
    <v-card-title lights-out style="text-shadow: 0 0 2px #000, 0 0 3px #000, 0 0 4px #000;">{{work.name}}</v-card-title>
    <v-card-subtitle style="color: #fff; text-shadow: 0 0 1px #000, 0 0 2px #000">Author: {{work.author}}</v-card-subtitle>
    <v-card-text style="color: #fff; text-shadow: 0 0 1px #000, 0 0 2px #000">Available at: <a :href="work.link" target="_blank">{{work.link}}</a></v-card-text>
    <v-card-text class="py-0">
      <div> Click flag to mark as read:
      <v-icon class="mr-1" v-if="!isAuthenticated" @click="onRead(work.id)"> mdi-flag-outline </v-icon>
      <v-icon class="mr-1" v-else-if="isAuthenticated && !read" @click="onRead(work.id)"> mdi-flag-outline </v-icon>
      <v-icon class="mr-1" v-else @click="onRead(work.id)"> mdi-flag </v-icon>
      </div>
      <div> Click heart to mark as liked:
      <v-icon class="mr-1" v-if="!isAuthenticated" @click="onLike(work.id)"> mdi-heart-outline </v-icon>
      <v-icon class="mr-1" v-else-if="isAuthenticated && !liked" @click="onLike(work.id)"> mdi-heart-outline </v-icon>
      <v-icon class="mr-1" v-else @click="onLike(work.id)"> mdi-heart </v-icon>
      </div>
    </v-card-text>
    <v-card-title>DESCRIPTION</v-card-title>
    <v-card-text><div v-html="work.description"></div></v-card-text>
    <v-card-title>INFORMATION</v-card-title>
    <v-card-text>Time investment: {{work.timeInvestmentString()}}
      <br>{{work.amount}}
      <br>Leaderboard tag: {{work.shortname}}
      <div id="readerslikers" v-if="readers && likers">
        <br>Read by: <span v-for="(reader,index) in readers" :key="'reader'+index"><span v-if="index>0">, </span><router-link :to="'/profile/'+reader.replace(/ /g, '+')">{{reader}}</router-link></span>
        <br>Liked by: <span v-for="(liker,index) in likers" :key="'liker'+index"><span v-if="index>0">, </span><router-link :to="'/profile/'+liker.replace(/ /g, '+')">{{liker}}</router-link></span>
      </div>
    </v-card-text>
    <v-card-title>ART</v-card-title>
    <v-card-text v-if="work.hasNoArt()">None yet! I encourage you to make some and send it to me.</v-card-text>
    <CoolLightBox
      :items="work.artList"
      :index="index"
      @close="index = null">
    </CoolLightBox>
    <div class="images-wrapper">
      <div class="image-wrapper" v-for="(image, imageIndex) in work.artList" :key="imageIndex">
      <div
        class="image"
        @click="index = imageIndex"
        :style="{ backgroundImage: 'url(' + image.src + ')'}"
      >
      </div>
      </div>
    </div>
    <v-card-title class="pb-0">TAGS</v-card-title>
    <div style="display: flex; flex-direction: column; flex-grow: 1;">
      <v-card-actions style="align-items: end; display: flex; flex-grow: 1;">
        <v-container class="mb-0 pl-1 pb-1 align-self-end">
          <v-slide-group
            multiple
          >
            <v-slide-item
              v-for="tag in work.tags"
              :key="tag"
            >
              <router-link :to="'/list/'+tag"><v-chip class="mr-1" style="cursor: pointer;">{{tag}}</v-chip></router-link>
            </v-slide-item>
          </v-slide-group>
        </v-container>
      </v-card-actions>
    </div>
    <div id="reviews" class="pb-3" v-if="reviews">
      <v-card-title class="pb-0">REVIEWS ({{reviews.length}})</v-card-title>
      <div style="display: flex; flex-direction: column; flex-grow: 1;" class="">
        <div v-for="review in reviewsSorted" :key="review.id">
            <router-link :to="'/profile/'+review.readername.replace(/ /g, '+')"><v-card-title class="pb-0 mb-0">{{review.readername}}</v-card-title></router-link>
            <v-card-subtitle>{{new Date(review.created).toLocaleDateString("en",{timeZone:"UTC"})}}</v-card-subtitle>
          <v-card-text><span class="review">{{review.review}}</span></v-card-text>

        </div>
      </div>
      <div style="display: flex; flex-direction: column; flex-grow: 1;" class="ma-4" v-if="isAuthenticated">
        <v-form v-model="valid" ref="form">
          <v-textarea
          :label="reviewLabel"
          auto-grow
          v-model="reviewContent"
          :rules="rules"
        ></v-textarea>
        <v-btn
          :disabled="!valid"
          color="secondary"
          class="mr-4"
          @click="onSubmitReview"
        >
          Submit
        </v-btn>
        </v-form>
      </div>
    </div>
  </v-card>
  </div>
</v-container>
</template>

<script>
import CoolLightBox from 'vue-cool-lightbox';
import api from '../auth/api';
import Shill from '../models/shill';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';

export default {
  metaInfo() {
    const work = this.work ? new Shill(this.work) : new Shill({});
    const workName = this.$route.params.name ? `${this.$route.params.name.replace(/\+/g, ' ')}` : 'Work page';
    return {
      title: `${workName} - The Shills List`,
      meta: [
        // Standard Metadata
        { vmid: 'description', name: 'description', content: work.description },
        // Open Graph Metadata
        { vmid: 'og:title', property: 'og:title', content: `${workName} - The Shills List` },
        { vmid: 'og:description', property: 'og:description', content: work.description },
        { vmid: 'og:image', property: 'og:image', content: work.image[0] },
        { vmid: 'og:url', property: 'og:url', content: window.location.href },
        { vmid: 'og:type', property: 'og:type', content: 'website' },
        { vmid: 'og:site_name', property: 'og:site_name', content: 'The Shills List' },
        // Twitter Metadata
        { vmid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { vmid: 'twitter:title', name: 'twitter:title', content: `${workName} - The Shills List` },
        { vmid: 'twitter:description', name: 'twitter:description', content: work.description },
        { vmid: 'twitter:image', name: 'twitter:image', content: work.image[0] },
        { vmid: 'twitter:site', name: 'twitter:site', content: '@recordcrash' },
      ]
    };
  },
  name: 'ShillView',
  components: { CoolLightBox },
  methods: {
    onClickTag(tag) {
      this.$emit('tag', tag);
    },
    async onLike(id) {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else if (!this.liked) {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.likeWork(id, readername);
          }
        } finally {
          this.localLikes += 1;
          this.liked = true;
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
          this.liked = false;
          document.activeElement.blur();
        }
      }
    },
    async onRead(id) {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else if (!this.read) {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.readWork(id, readername);
          }
        } finally {
          this.localReads += 1;
          this.read = true;
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
          this.read = false;
          document.activeElement.blur();
        }
      }
    },
    async onSubmitReview() {
      const reviewObject = {
        readername: this.$auth.user.name,
        workid: this.work.id,
        review: this.reviewContent,
      };
      try {
        await api.reviewWork(reviewObject);
      } catch (err) {
        console.log(err);
      } finally {
        this.reviews = await api.requestReviewsForWork(this.work.id);
      }
    },
    handleReviewDefault() {
      if (this.isAuthenticated) {
        const found = this.reviews.find((el) => el.readername === this.$auth.user.name);
        if (found) this.reviewContent = found.review;
      }
    },
  },
  computed: {
    isAuthenticated() {
      return this.$auth.isAuthenticated;
    },
    reviewLabel() {
      const found = this.reviews.find((el) => el.readername === this.$auth.user.name);
      if (found) return 'Edit your review';
      return 'Add new review';
    },
    reviewsSorted() {
      return [...this.reviews].reverse();
    },
    rules() {
      return [((v) => (v || '').length <= 5327 || 'A maximum of 5327 characters is allowed')];
    },
    isRead() {
      return !!this.allWorksRead.find((el) => el.readername === this.$auth?.user?.name && el.work === this.work.id);
    },
    isLiked() {
      return !!this.allWorksLiked.find((el) => el.readername === this.$auth?.user?.name && el.work === this.work.id);
    },
  },
  async mounted() {
    // Check shill exists before doing anything, else return to home page
    const shillId = Number.parseInt(this.$route.params.id, 10) || 1;
    const works = await api.requestShillsList();
    const foundShill = works.find((el) => el.id === shillId);
    if (!foundShill) this.$router.push('/');
    this.work = new Shill(foundShill);
    this.works = works;

    // Handle metadata
    // Set the document title
    const workName = this.$route.params.name ? `${this.$route.params.name.replace(/\+/g, ' ')}` : 'Work page';
    document.title = `${workName} - The Shills List`;

    // Handle read/liked status
    this.username = this.$auth.user ? this.$auth.user.name : null;
    const promises = await Promise.all([
      await api.requestAllWorksRead(),
      await api.requestAllWorksLiked(),
    ]);
    [this.allWorksRead, this.allWorksLiked] = promises;
    this.readers = this.allWorksRead.filter((el) => el.work === shillId).map((el) => el.readername);
    this.likers = this.allWorksLiked.filter((el) => el.work === shillId).map((el) => el.readername);
    this.read = this.isRead;
    this.liked = this.isLiked;

    // Handle reviews
    this.reviews = await api.requestReviewsForWork(shillId);
    this.handleReviewDefault();

    // Set meta info
    this.$meta().refresh();
  },
  data() {
    return {
      index: null,
      work: null,
      readers: [],
      likers: [],
      reviews: [],
      username: '',
      localLikes: 0,
      localReads: 0,
      allWorksRead: [],
      allWorksLiked: [],
      read: false,
      liked: false,
      valid: false,
      reviewContent: null,
    };
  },
  watch: {
    ownReviewContent(oldContent, newContent) {
      this.reviewContent = newContent;
    },
    isRead(newRead) {
      this.read = newRead;
    },
    isLiked(newLiked) {
      this.liked = newLiked;
    },
  },
};
</script>

<style scoped>
a {text-decoration: none; }
.review {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>

<style>
.images-wrapper {
 display:-webkit-box;
 display:-ms-flexbox;
 display:flex;
 flex-wrap: wrap;
 margin-right:-10px;
 margin-left: 15px;
}
.image-wrapper {
  flex-basis: 30%;
}
@media (min-width:767px){
  .image-wrapper {
    flex-basis: 10%;
  }
}
@media (min-width:767px) {
 .images-wrapper {
  margin-right:-20px
 }
}
.images-wrapper .image-wrapper {
 margin-bottom:10px;
 width:calc(50% - 10px);
 margin-right:10px
}
@media (min-width:767px) {
 .images-wrapper .image-wrapper {
  margin-bottom:20px;
  width:calc(16.66667% - 20px);
  margin-right:20px
 }
}
.images-wrapper .image-wrapper .image {
 cursor:pointer;
 background-position:50%;
 background-repeat:no-repeat;
 background-size:cover;
 padding-top:100%
}
</style>
