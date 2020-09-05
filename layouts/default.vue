<template>
  <v-app id="app" dark>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :fixed="fixed" app color="primary">
      <span>&copy; {{ new Date().getFullYear() }}</span>
      <v-spacer />
      <span>(( MtR ))</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      fixed: false
    }
  }
}
</script>
<style>
#app {
  background-color: var(--v-background-base);
}
</style>
