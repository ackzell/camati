<template>
  <v-list-item :ripple="false">
    <v-list-item-avatar>
      <v-btn x-large icon @click="toggleAudio">
        <v-icon v-if="isPlaying">mdi-pause</v-icon>
        <v-icon v-else>mdi-play</v-icon>
      </v-btn>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="overline">
        Recording {{ index + 1 }}
      </v-list-item-title>
      <v-slider
        value="45"
        active
        color="primary lighten-4"
        rounded
        inverse-label
        :label="timeAndDuration"
      />
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon color="primary darken-3" @click.stop>
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action>
      <v-btn icon x-small>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
export default {
  props: {
    recording: {
      type: Object,
      default: () => ({
        audio: null,
        isPlaying: false
      })
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      track: null,
      isPlaying: false,
      totalDuration: null
    }
  },
  computed: {
    timeAndDuration() {
      let minutes = Math.floor(this.totalDuration / 60)
      let seconds = parseInt(this.totalDuration, 10) - minutes * 60

      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return `00:00 / ${minutes}:${seconds}`
    }
  },
  beforeMount() {
    this.track = new Audio(this.recording.audio)

    this.track.addEventListener('loadeddata', () => {
      console.log('finished loading')
      console.log(this.track.duration)
      this.totalDuration = this.track.duration
    })

    this.track.addEventListener('ended', () => {
      console.log('ended!')
      this.isPlaying = false
    })
  },
  methods: {
    toggleAudio() {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.track.play()
      } else {
        this.track.pause()
      }
    }
  }
}
</script>
