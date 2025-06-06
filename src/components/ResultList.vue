<script setup>
  import { copyToClipboard } from '@/copy.js';

  const model = defineModel();
  const props = defineProps({
    label: { required: false, type: String, default: 'N/A' },
  });
</script>

<template>

  <v-list density="compact">
    <v-list-item
      v-for="(item, index) in model"
      :key="index"
      :title="props.label"
      @click="copyToClipboard(item)"
    >
      <v-list-item-title>{{ item }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
