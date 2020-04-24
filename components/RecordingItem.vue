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
        :value="progress"
        active
        color="primary lighten-4"
        rounded
        inverse-label
        :label="`${elapsedTime} / ${totalTime}`"
        @change="seek"
        @start="sliderConnected = false"
        @end="sliderConnected = true"
      />
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon x-small color="primary darken-3">
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
function getMMSS(duration) {
  let minutes = Math.floor(duration / 60)
  let seconds = parseInt(duration, 10) - minutes * 60

  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }

  return `${minutes}:${seconds}`
}

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
      totalDuration: null,
      elapsedTime: `00:00`,
      progress: 0,
      sliderConnected: true
    }
  },
  computed: {
    totalTime() {
      return getMMSS(this.totalDuration)
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

    this.track.addEventListener('timeupdate', (event) => {
      const s = parseInt(this.track.currentTime % 60)
      this.elapsedTime = getMMSS(s)

      if (this.sliderConnected) {
        this.progress = (this.track.currentTime * 100) / this.track.duration
      }
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
    },
    seek(payload) {
      if (typeof payload === 'number') {
        console.log('endseeking', payload)
        console.log((payload * this.track.duration) / 100)
        this.track.currentTime = (payload * this.track.duration) / 100
      }
    }
  }
}
</script>
