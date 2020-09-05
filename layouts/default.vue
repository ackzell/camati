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
console.log(
  `
   ____  __  __ _   ___  ____
  / / / |  \\/  | |_| _ \\ \\ \\ \\
 | | |  | |\\/| |  _|   /  | | |
 | | |  |_|  |_|\\__|_|_\\  | | |
  \\_\\_\\                  /_/_/

    Hi there! 👋
    Thanks for checking out the console, welcome to the guts of this app.
    Powered by Camati: https://www.youtube.com/playlist?list=PLmJs3lfUmCdR-1js29OeqNR_YBm2Qy2r5
  `
)
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
