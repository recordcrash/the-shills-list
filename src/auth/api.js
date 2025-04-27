import axios from 'axios';

const BASE_URL = 'https://homestuck.net/api';

const api = {
  async requestToken(auth) {
    const token = await auth.getTokenSilently();
    const { data } = await axios.get('/api/external', {
      headers: {
        Authorization: `Bearer ${token}`, // send the access token through the 'Authorization' header
      },
    });
    return data;
  },

  async requestShillsList() {
    const { data } = await axios.get(`${BASE_URL}/works`);
    return data;
  },

  async requestTweets() {
    const { data } = await axios.get(`${BASE_URL}/twitter`);
    return data;
  },

  async requestReaders() {
    const { data } = await axios.get(`${BASE_URL}/readers`);
    return data;
  },
  async requestProgress() {
    const { data } = await axios.get(`${BASE_URL}/progress`);
    return data;
  },

  async requestAllWorksRead() {
    const { data } = await axios.get(`${BASE_URL}/works/worksread/1`);
    return data;
  },
  async requestAllWorksLiked() {
    const { data } = await axios.get(`${BASE_URL}/works/worksliked/1`);
    return data;
  },
  async requestAllReviews() {
    const { data } = await axios.get(`${BASE_URL}/reviews/`);
    return data;
  },
  async requestReviewsForWork(id) {
    const { data } = await axios.get(`${BASE_URL}/reviews/${id}`);
    return data;
  },
  async requestReviewsByReader(username) {
    const { data } = await axios.get(`${BASE_URL}/reviews/reader/${username}`);
    return data;
  },
  async reviewWork(reviewObject) {
    const { data } = await axios.post(`${BASE_URL}/reviews/review/${reviewObject.workid}`, reviewObject);
    return data;
  },
  async likeWork(id, readername) {
    const { data } = await axios.post(`${BASE_URL}/works/like/${id}/${readername}`);
    return data;
  },
  async readWork(id, readername) {
    const { data } = await axios.post(`${BASE_URL}/works/read/${id}/${readername}`);
    return data;
  },
};

export default api;
