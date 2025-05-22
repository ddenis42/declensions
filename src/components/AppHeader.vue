<script setup>
  import { mdiThemeLightDark } from '@mdi/js';
  import { onBeforeMount } from 'vue';
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  onBeforeMount(() => {
    try {
      const storedTheme = JSON.parse(localStorage.getItem('theme'));
      if (['light', 'dark'].includes(storedTheme) && storedTheme !== theme.global.name.value) {
        theme.global.name.value = storedTheme;
      }
    } catch (error) {
      console.error(error);
    }
  });

  const toggleTheme = () => {
    const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
    theme.global.name.value = newTheme;
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };
</script>

<template>
  <v-app-bar hide-on-scroll>

    <v-app-bar-title>
      Відмінювання українських імен
      <span class="d-none d-sm-inline-block" style="color: gray">(посади, звання ЗСУ, ПІБ)</span>
    </v-app-bar-title>

    <v-btn :icon="mdiThemeLightDark" @click="toggleTheme" />

  </v-app-bar>
</template>
