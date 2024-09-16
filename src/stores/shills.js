// src/stores/shills.js
import { defineStore } from 'pinia'
import Shill from '../models/Shill'
import api from '../services/api'
import WilsonScore from '../helpers/wilsonScore'

export const useShillsStore = defineStore('shills', {
  state: () => ({
    shills: [],
    reads: [],
    likes: [],
    includedTags: ['Main'],
    excludedTags: ['Flawed', 'Custom'],
    sortedBy: 'Recommended',
    sortings: ['Recommended', 'Best', 'Likes', 'Readers', 'Alphabetical', 'Time investment'],
    show: 'All',
    showings: ['All', 'Uncompleted', 'Completed'],
    currentUser: null, // Placeholder for authenticated user
  }),
  getters: {
    sortedShillsList(state) {
      if (!state.shills.length) return []
      switch (state.sortedBy) {
        case 'Best':
          return [...state.shills].sort(
            (a, b) => WilsonScore.lowerBound(b.likes, b.readers) - WilsonScore.lowerBound(a.likes, a.readers)
          )
        case 'Likes':
          return [...state.shills].sort((a, b) => b.likes - a.likes)
        case 'Readers':
          return [...state.shills].sort((a, b) => b.readers - a.readers)
        case 'Alphabetical':
          return [...state.shills].sort((a, b) => a.name.localeCompare(b.name))
        case 'Time investment':
          return [...state.shills].sort((a, b) => b.hours - a.hours)
        case 'Recommended':
        default:
          return state.shills
      }
    },
    filteredShills(state) {
      return this.sortedShillsList.filter(
        shill =>
          this.includedTags.every(tag => shill.tags.includes(tag)) &&
          !this.excludedTags.some(tag => shill.tags.includes(tag))
      )
    },
    shownShills(state) {
      switch (state.show) {
        case 'Completed':
          return this.filteredShills.filter(shill => this.shillIsRead(shill.id))
        case 'Uncompleted':
          return this.filteredShills.filter(shill => !this.shillIsRead(shill.id))
        default:
          return this.filteredShills
      }
    },
    allTags(state) {
      const tags = new Set()
      state.shills.forEach(shill => shill.tags.forEach(tag => tags.add(tag)))
      return Array.from(tags)
    },
  },
  actions: {
    async fetchShills() {
      try {
        const data = await api.requestShillsList()
        this.shills = Shill.toInstanceList(data)
      } catch (error) {
        console.error('Error fetching shills:', error)
      }
    },
    async fetchReads() {
      try {
        this.reads = await api.requestAllWorksRead()
      } catch (error) {
        console.error('Error fetching reads:', error)
      }
    },
    async fetchLikes() {
      try {
        this.likes = await api.requestAllWorksLiked()
      } catch (error) {
        console.error('Error fetching likes:', error)
      }
    },
    setIncludedTags(tags) {
      this.includedTags = tags
    },
    setExcludedTags(tags) {
      this.excludedTags = tags
    },
    setSortedBy(sort) {
      this.sortedBy = sort
    },
    setShow(show) {
      this.show = show
    },
    setCurrentUser(user) {
      this.currentUser = user
    },
    shillIsRead(id) {
      if (!this.currentUser) return false
      return this.reads.some(read => read.readername === this.currentUser.name && read.work === id)
    },
  },
})
