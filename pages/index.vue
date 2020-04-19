<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <p class="caption text-right">
        You can record a quick message (up to 1 min) and send it to us!
      </p>
      <v-card class="elevation-12">
        <v-toolbar color="primary" flat>
          <v-toolbar-title>VoiceMail</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            :color="isRecording ? 'red' : 'primary darken-2'"
            @click="isRecording = !isRecording"
          >
            <v-icon dark>{{
              isRecording ? 'mdi-record-rec' : 'mdi-microphone'
            }}</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <p class="display-2 text-center">01:12</p>

          <v-list elevation="5" shaped color="primary">
            <v-list-item-group v-model="selected" mandatory>
              <v-list-item>
                <v-list-item-avatar>
                  <v-btn x-large icon>
                    <!-- <v-icon color="">mdi-play</v-icon> -->
                    <v-icon>mdi-pause</v-icon>
                  </v-btn>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="overline">
                    Recording 1
                  </v-list-item-title>
                  01:34
                  <v-progress-linear
                    value="45"
                    active
                    color="primary lighten-4"
                    rounded
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

              <v-divider inset></v-divider>

              <v-list-item>
                <v-list-item-avatar>
                  <v-btn x-large icon>
                    <v-icon color="">mdi-play</v-icon>
                  </v-btn>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="overline">
                    Recording 2
                  </v-list-item-title>
                  00:03
                  <v-progress-linear
                    value="0"
                    active
                    class="primary lighten-4"
                    rounded
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

              <v-divider inset></v-divider>

              <v-list-item>
                <v-list-item-avatar>
                  <v-btn x-large icon>
                    <v-icon color="">mdi-play</v-icon>
                    <!-- <v-icon>mdi-pause</v-icon> -->
                  </v-btn>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="overline">
                    Recording 3
                  </v-list-item-title>
                  01:12
                  <v-progress-linear
                    value="4"
                    active
                    class="primary lighten-4"
                    rounded
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
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="primary" :disabled="!audios.length">Send it!</v-btn> -->
        </v-card-actions>
      </v-card>

      <v-card class="mt-4">
        <v-card-text>
          <v-text-field
            name="name"
            label="Your Name"
            single-line
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!audios.length">Send it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { WebAudioRecorder } from 'web-audio-recorder-js-webpack'

// import RecordingButton from '@/components/RecordingButton.vue'

const ENCODING_TYPE = 'mp3'
const ENCODE_AFTER_RECORD = true

export default {
  components: {
    // RecordingButton
  },
  data() {
    return {
      availableDevices: [],
      selectedDevice: null,
      logData: '',
      isRecording: false,
      audios: [],
      getUserMediaStream: null,
      recorder: null,
      input: null,
      audioContext: null,
      selected: null
    }
  },
  async created() {
    if (navigator && navigator.mediaDevices) {
      const mediaDevices = await navigator.mediaDevices.getUserMedia({
        audio: true
      })

      if (mediaDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices()

        this.availableDevices = devices.filter(
          (device) => device.kind === 'audioinput'
        )
      }
    }
  },
  methods: {
    inputChanged() {
      // console.log('input changed')
      if (this.getUserMediaStream) {
      }
      navigator.mediaDevices.getUserMedia({
        audio: true,
        deviceId: {
          exact: this.selectedDevice
        }
      })
    },
    startRecording() {
      if (navigator.mediaDevices) {
        console.warn(
          'about to start recording using',
          this.availableDevices.find((d) => d.deviceId === this.selectedDevice)
        )

        navigator.mediaDevices
          .getUserMedia({
            audio: true,
            deviceId: {
              exact: this.selectedDevice
            }
          })
          .then((stream) => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
              this.availableDevices = devices.filter(
                (device) => device.kind === 'audioinput'
              )
            })

            this.log(
              'getUserMedia() success, stream created, initializing WebAudioRecorder...'
            )

            const AudioContext =
              window.AudioContext || window.webkitAudioContext
            this.audioContext = new AudioContext()

            // assign to getUserMediaStream for later use
            this.getUserMediaStream = stream
            /* use the stream */
            this.input = this.audioContext.createMediaStreamSource(stream)

            this.recorder = new WebAudioRecorder(this.input, {
              workerDir: 'js/web-audio-recorder-js-master/lib-minified/',
              encoding: ENCODING_TYPE,
              onEncoderLoading: (recorder, encoding) => {
                // show "loading encoder..." display
                this.log('Loading ' + encoding + ' encoder...')
              },
              onEncoderLoaded: (recorder, encoding) => {
                // hide "loading encoder..." display
                this.log(encoding + ' encoder loaded')
              },
              onComplete: (recorder, blob) => {
                this.log('Encoding complete')
                const url = URL.createObjectURL(blob)
                this.audios.push(url)
                // createDownloadLink(blob, recorder.encoding);
              }
            })

            this.recorder.setOptions({
              timeLimit: 300,
              encodeAfterRecord: ENCODE_AFTER_RECORD,
              mp3: {
                bitRate: 160
              }
            })

            this.recorder.startRecording()
            this.log('Recording started')
            this.isRecording = true
          })
          .catch((err) => {
            console.error('something went terribly wrong', err)
          })
      }
    },
    stopRecording() {
      this.isRecording = false
      // stop microphone access
      //! can't do this, otherwise can't record further notes

      // see https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/
      // I don't understand why they initialize the recording object
      // every single time a new recording is started 🤔
      this.getUserMediaStream.getAudioTracks()[0].stop()

      // tell the recorder to finish the recording (stop recording + encode the recorded audio)
      this.recorder.finishRecording()
      this.log('Recording stopped')
    },
    log(event) {
      this.logData += event + `<br>`
    }
  }
}
</script>
<style lang="scss">
.v-application--is-ltr .v-list-item__action:last-of-type:not(:only-child),
.v-application--is-ltr .v-list-item__avatar:last-of-type:not(:only-child),
.v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child) {
  margin-left: 0;
}
</style>
