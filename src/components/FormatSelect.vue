<script setup>
  const model = defineModel({ type: Array });

  const props = defineProps({
    items: { required: true, type: Array },
    label: { required: true, type: String },
    itemTitle: undefined,
    itemValue: undefined,
  })
</script>

<template>
  <v-select
    v-model="model"
    chips
    :item-title="props.itemTitle"
    :item-value="props.itemValue"
    :items="props.items"
    :label="props.label"
    multiple
    variant="underlined"
  />
</template>
