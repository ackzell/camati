<template>
  <v-list-item :ripple="false">
    <div class="mr-5 d-none d-sm-flex">
      <span class="overline mr-1">Recording {{ recording.number }}</span>
    </div>
    <v-list-item-avatar>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn x-large icon @click="toggleAudio" v-on="on">
            <v-icon v-if="isPlaying">mdi-pause</v-icon>
            <v-icon v-else>mdi-play</v-icon>
          </v-btn>
        </template>
        <span v-if="isPlaying">Pause</span>
        <span v-else>Play</span>
      </v-tooltip>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-slider
        active
        color="primary lighten-4"
        rounded
        :value="progress"
        :hide-details="true"
        @change="seek"
        @start="sliderConnected = false"
        @end="sliderConnected = true"
      >
        <template v-slot:prepend>
          <span class="caption">{{ elapsedTime }}</span>
        </template>

        <template v-slot:append>
          <span class="caption">{{ totalDuration }}</span>
        </template>
      </v-slider>
    </v-list-item-content>
    <v-list-item-action-text class="ml-2">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            x-small
            color="primary darken-3"
            :href="href"
            :download="download"
            v-on="on"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <span>Download</span>
      </v-tooltip>
    </v-list-item-action-text>

    <v-list-item-action-text>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            x-small
            color="primary lighten-3"
            @click="$emit('remove-item', recording.id)"
            v-on="on"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Remove</span>
      </v-tooltip>
    </v-list-item-action-text>
  </v-list-item>
</template>
<script>
function getMMSS(timeInSeconds) {
  let minutes = Math.floor(timeInSeconds / 60)
  let seconds = parseInt(timeInSeconds, 10) - minutes * 60

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
        encoding: 'mp3'
      })
    }
  },
  data() {
    return {
      track: null,
      isPlaying: false,
      totalDuration: null,
      elapsedTime: `00:00`,
      progress: 0,
      sliderConnected: true,
      href: null,
      download: ''
    }
  },
  beforeMount() {
    this.track = new Audio(this.recording.audio)

    this.href = this.recording.audio
    this.download = `Recording ${this.recording.number + 1}.${
      this.recording.encoding
    }`

    this.track.addEventListener('loadeddata', () => {
      console.log('finished loading')
      console.log(this.track.duration)
      this.totalDuration = getMMSS(this.track.duration)
    })

    this.track.addEventListener('ended', () => {
      console.log('ended!')
      this.isPlaying = false
    })

    this.track.addEventListener('timeupdate', (event) => {
      const s = parseInt(this.track.currentTime, 10)
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
        this.track.currentTime = (payload * this.track.duration) / 100
      }
    }
  }
}
</script>
<style lang="scss">
.v-application--is-ltr .v-list-item__avatar:first-child {
  margin-right: 8px;
}
.v-input__slider {
  align-items: center;
}
</style>
