<script setup>
  const model = defineModel({ type: Array });

  const props = defineProps({
    items: { required: true, type: Array },
    label: { required: true, type: String },
    itemTitle: undefined,
    itemValue: undefined,
  })

  const rules = [
    value => value?.length > 0 || 'Виберіть значення.',
  ]
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
    :rules="rules"
    variant="underlined"
  />
</template>
