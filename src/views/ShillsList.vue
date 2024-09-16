<script setup>
import { onMounted } from 'vue'
import { useShillsStore } from '../stores/shills'
import ShillCard from '../components/ShillCard.vue'
import { useRoute } from 'vue-router'

const store = useShillsStore()
const route = useRoute()

onMounted(async () => {
  await store.fetchShills()
  await store.fetchReads()
  await store.fetchLikes()
  processRoute()
})

function processRoute() {
  if (route.params.tag) {
    const tag = route.params.tag.charAt(0).toUpperCase() + route.params.tag.slice(1)
    switch (tag.toLowerCase()) {
      case 'all':
        store.setIncludedTags([])
        store.setExcludedTags(['Flawed', 'Main', 'Custom'])
        break
      case 'custom':
        store.setIncludedTags(['Custom'])
        store.setExcludedTags(['Drewshills', 'Kidpenshills'])
        break
      case 'drewshills':
        store.setIncludedTags(['Drewshills'])
        store.setExcludedTags([])
        break
      case 'kidpenshills':
        store.setIncludedTags(['Kidpenshills'])
        store.setExcludedTags([])
        break
      default:
        store.setIncludedTags([tag])
        store.setExcludedTags(['Custom'])
    }
  }
}
</script>

<template>
  <div class="shills-list">
    <div class="filters">
      <div class="filter-item">
        <label>Show only</label>
        <select v-model="store.includedTags" multiple>
          <option v-for="tag in store.allTags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label>Exclude</label>
        <select v-model="store.excludedTags" multiple>
          <option v-for="tag in store.allTags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label>Sort by</label>
        <select v-model="store.sortedBy">
          <option v-for="sorting in store.sortings" :key="sorting" :value="sorting">{{ sorting }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label>Completion status</label>
        <select v-model="store.show">
          <option v-for="showing in store.showings" :key="showing" :value="showing">{{ showing }}</option>
        </select>
      </div>
    </div>
    <div class="shills">
      <ShillCard
        v-for="shill in store.shownShills"
        :key="shill.id"
        :isAuthenticated="store.currentUser !== null"
        :work="shill"
        :maxWidth="375"
        :minWidth="300"
        :reads="store.reads"
        :likes="store.likes"
        @tag="handleTag"
      />
    </div>
  </div>
</template>

<style scoped>
.shills-list {
  padding: 2rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-item label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.filter-item select {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.shills {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
</style>
