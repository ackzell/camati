<template>
  <p class="display-2 text-center">{{ minutes }}</p>
</template>

<script>
export default {
  props: {
    elapsedTime: {
      type: Number,
      default: 0
    }
  },
  computed: {
    minutes() {
      let minutes = Math.floor(this.elapsedTime / 60)
      let seconds = this.elapsedTime - minutes * 60

      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return minutes + ':' + seconds
    }
  }
}
</script>
