<script setup>

  import { copyToClipboard } from '@/copy.js';
  import { mdiContentCopy } from '@mdi/js';

  const model = defineModel();
  const props = defineProps({
    label: { required: false, type: String, default: 'N/A' },
  });
  const modelText = computed(() => model.value.join('\n'));
</script>

<template>
  <div v-ripple class="textarea-container">
    <v-textarea
      v-model="modelText"
      v-ripple.stop
      auto-grow
      hide-details
      :label="props.label"
      readonly
      rows="1"
      style="width: 100%;"
      variant="outlined"
    />
    <div class="copy-icon-container">
      <v-icon
        v-if="modelText"
        :icon="mdiContentCopy"
        @click="copyToClipboard(modelText)"
      />
    </div>
  </div>
</template>

<style scoped>
.textarea-container {
  position: relative;
}

.copy-icon-container {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  opacity: 0.75;
}
</style>
