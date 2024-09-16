import axios from 'axios'

const BASE_URL = 'https://homestuck.net/api'

const api = {
  async requestShillsList() {
    const { data } = await axios.get(`${BASE_URL}/works`)
    return data
  },
  async requestAllWorksRead() {
    const { data } = await axios.get(`${BASE_URL}/works/worksread/1`)
    return data
  },
  async requestAllWorksLiked() {
    const { data } = await axios.get(`${BASE_URL}/works/worksliked/1`)
    return data
  },
  async requestReviewsForWork(id) {
    const { data } = await axios.get(`${BASE_URL}/reviews/${id}`)
    return data
  },
  async reviewWork(reviewObject) {
    const { data } = await axios.post(`${BASE_URL}/reviews/review/${reviewObject.workid}`, reviewObject)
    return data
  },
  async likeWork(id, readername) {
    const { data } = await axios.post(`${BASE_URL}/works/like/${id}/${readername}`)
    return data
  },
  async readWork(id, readername) {
    const { data } = await axios.post(`${BASE_URL}/works/read/${id}/${readername}`)
    return data
  },
}

export default api
