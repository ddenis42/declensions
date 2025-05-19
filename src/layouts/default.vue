<script setup lang="ts">
  import AppFooter from '@/components/AppFooter.vue';
  import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <AppHeader />

  <v-main>
    <div style="margin: 1% 5%">
      <router-view />
    </div>
  </v-main>

  <AppFooter />
</template>
