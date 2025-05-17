<script setup>
  const model = defineModel();
  const modelText = computed(() => model.value.join('\n'));
  const props = defineProps({
    type: { required: false, type: String, default: 'field' },
    label: { required: false, type: String, default: 'N/A' },
  });
  const showSnackbar = ref(false);
  const message = ref('');

  const copyToClipboard = async text => {
    showMessage('Copied to clipboard!');
    navigator.clipboard
      .writeText(text)
      .then(
        () => showMessage('Copied to clipboard!'),
        () => {
          // fallback for unsupported browsers
          const ta = document.createElement('textarea')
          ta.value = text
          ta.style.position = 'fixed'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        })
  };

  const showMessage = msg => {
    message.value = msg;
    showSnackbar.value = true;
  };
</script>

<template>

  <v-list v-if="props.type === 'list'" density="compact">
    <v-list-item
      v-for="(item, index) in model"
      :key="index"
      @click="copyToClipboard(item)"
    >
      <v-list-item-title>{{ item }}</v-list-item-title>
    </v-list-item>
  </v-list>

  <v-textarea
    v-if="(props.type ?? 'field') === 'field'"
    v-model="modelText"
    auto-grow
    :label="props.label"
    readonly
    rows="1"
    style="width: 100%"
  />

  <v-snackbar v-model="showSnackbar" color="success" :timeout="1000">
    {{ message }}
  </v-snackbar>
</template>
