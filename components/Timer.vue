<template>
  <p
    class="display-2 text-center"
    :class="{
      'yellow--text': remainingTime > 5 && remainingTime <= 10,
      'red--text': remainingTime > 0 && remainingTime <= 5
    }"
  >
    {{ minutes }}
  </p>
</template>

<script>
export default {
  props: {
    timerStatus: {
      type: String,
      default: 'stopped' // 'started'
    },
    timeLimit: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      remainingTime: this.timeLimit,
      interval: null,
      isRunning: false
    }
  },
  computed: {
    minutes() {
      let minutes = Math.floor(this.remainingTime / 60)
      let seconds = this.remainingTime - minutes * 60

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
      this.remainingTime = --this.remainingTime
      if (this.remainingTime > this.timeLimit) {
        this.stopTimer()
      }
    },
    stopTimer() {
      // reset the count
      this.remainingTime = this.timeLimit
      // and reset the timer
      clearInterval(this.interval)
      this.isRunning = false
    }
  }
}
</script>
