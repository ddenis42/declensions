<script setup>
  const items = [
    {
      title: 'Declensions GitHub',
      icon: `mdi-github`,
      href: 'https://github.com/ddenis42/declensions',
    },
    {
      title: 'Denys Demydovych',
      icon: `mdi-linkedin`,
      href: 'https://www.linkedin.com/in/demydovych',
    },
  ]
</script>

<template>
  <v-footer app height="40">
    <div class="text-caption text-disabled">
      Based on
      <a
        class="text-decoration-none on-surface"
        href="https://shevchenko-js.tooleks.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        shevchenko-js<span class="d-none d-sm-inline-block">.tooleks.com</span>
      </a>
    </div>

    <div class="text-caption text-disabled" style="position: absolute; right: 1rem;">
      <a
        v-for="item in items"
        :key="item.title"
        class="d-inline-block mx-1 social-link"
        :href="item.href"
        rel="noopener noreferrer"
        target="_blank"
        :title="item.title"
      >
        <v-icon :icon="item.icon" :size="24" />
      </a>
      &copy; 2025-{{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Denys Demydovych</span>
      —
      <a
        class="text-decoration-none on-surface"
        href="https://github.com/ddenis42/declensions/blob/main/LICENSE"
        rel="noopener noreferrer"
        target="_blank"
      >
        MIT License
      </a>
    </div>
  </v-footer>
</template>

<style lang="sass" scoped>
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
