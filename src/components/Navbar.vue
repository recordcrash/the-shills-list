<template>
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/list">Shills List</RouterLink>
      </nav>
    </header>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  header {
    background-color: var(--color-background-soft);
    padding: 1rem;
    display: flex;
    justify-content: center;
  }
  
  nav a {
    margin: 0 1rem;
    text-decoration: none;
    color: var(--color-text);
    font-weight: bold;
  }
  
  nav a.router-link-exact-active {
    color: var(--color-heading);
  }
  </style>
  