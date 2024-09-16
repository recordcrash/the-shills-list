<template>
    <v-card :max-width="maxWidth" :min-width="minWidth" class="shill-card" elevation="4">
      <v-img :src="work.image[0]" height="200px" class="white--text align-end">
        <v-card-title>{{ work.name }}</v-card-title>
        <v-card-subtitle>{{ work.author }}</v-card-subtitle>
      </v-img>
      <v-card-text>
        <div v-html="work.description"></div>
      </v-card-text>
      <v-card-actions>
        <v-chip-group
            multiple
            column
            class="shill-tags"
            style="overflow-x: auto; white-space: nowrap;"
        >
            <v-chip
                v-for="tag in work.tags"
                :key="tag"
                class="ma-1"
                color="primary"
                text-color="white"
                @click="onClickTag(tag)"
                clickable
            >
                {{ tag }}
            </v-chip>
        </v-chip-group>
      </v-card-actions>
      <v-card-actions>
        <v-btn icon @click="onLike(work.id)" :title="likedTooltip">
          <v-icon>{{ localLiked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
        <v-btn icon @click="onRead(work.id)" :title="readTooltip">
          <v-icon>{{ localRead ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}</v-icon>
        </v-btn>
        <span class="ml-2">{{ localLikes }} Likes</span>
        <span class="ml-4">{{ localReads }} Reads</span>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import api from '../services/api'
  import { useShillsStore } from '../stores/shills'
  import { VCard, VImg, VCardTitle, VCardSubtitle, VCardText, VCardActions, VChip, VBtn, VIcon } from 'vuetify/components'
  
  const props = defineProps({
    isAuthenticated: Boolean,
    work: Object,
    maxWidth: Number,
    minWidth: Number,
    reads: Array,
    likes: Array,
  })
  
  const emit = defineEmits(['tag'])
  
  const store = useShillsStore()
  
  const localLikes = ref(props.work.likes)
  const localReads = ref(props.work.readers)
  const localLiked = ref(isLiked())
  const localRead = ref(isRead())
  
  function isLiked() {
    if (!store.currentUser) return false
    return store.likes.some(like => like.readername === store.currentUser.name && like.work === props.work.id)
  }
  
  function isRead() {
    if (!store.currentUser) return false
    return store.reads.some(read => read.readername === store.currentUser.name && read.work === props.work.id)
  }
  
  const likedTooltip = computed(() => `${localLikes.value} people have enjoyed this work`)
  const readTooltip = computed(() => `${localReads.value} people have finished this work`)
  
  function onClickTag(tag) {
    emit('tag', tag)
  }
  
  async function onLike(id) {
    if (!props.isAuthenticated) {
      // Handle unauthenticated state, e.g., redirect to login
      return
    }
    if (!localLiked.value) {
      try {
        const readername = store.currentUser.name
        if (readername) {
          await api.likeWork(id, readername)
          localLikes.value += 1
          localLiked.value = true
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const readername = store.currentUser.name
        if (readername) {
          await api.likeWork(id, readername)
          localLikes.value -= 1
          localLiked.value = false
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  
  async function onRead(id) {
    if (!props.isAuthenticated) {
      // Handle unauthenticated state, e.g., redirect to login
      return
    }
    if (!localRead.value) {
      try {
        const readername = store.currentUser.name
        if (readername) {
          await api.readWork(id, readername)
          localReads.value += 1
          localRead.value = true
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const readername = store.currentUser.name
        if (readername) {
          await api.readWork(id, readername)
          localReads.value -= 1
          localRead.value = false
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  </script>
  
  <style scoped>
  .shill-card {
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .shill-card:hover {
    transform: scale(1.05);
  }
  
  .ml-2 {
    margin-left: 0.5rem;
  }
  
  .ml-4 {
    margin-left: 1rem;
  }
  </style>
  