<template>
  <p class="display-2 text-center">{{ minutes }}</p>
</template>

<script>
export default {
  props: {
    timerStatus: {
      type: String,
      default: 'stopped' // 'started'
    }
  },
  data() {
    return {
      elapsedTime: 0,
      interval: null,
      isRunning: false
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
  },
  watch: {
    timerStatus(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal === 'stopped') {
          this.stopTimer()
        } else {
          this.toggleTimer()
        }
      }
    }
  },
  methods: {
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.interval)
      } else {
        this.interval = setInterval(this.incrementTime, 1000)
      }
      this.isRunning = !this.isRunning
    },
    incrementTime() {
      this.elapsedTime = +this.elapsedTime + 1
    },
    stopTimer() {
      // reset the count
      this.elapsedTime = 0
      // and reset the timer
      clearInterval(this.interval)
      this.isRunning = false
    }
  }
}
</script>
