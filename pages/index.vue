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
            @click="toggleRecorder"
          >
            <v-icon dark>{{
              isRecording ? 'mdi-pause' : 'mdi-microphone'
            }}</v-icon>
          </v-btn>
          <v-btn icon @click="stopRecording">
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <current-timer :elapsed-time="timer"></current-timer>

          <recordings-list
            v-model="selected"
            :recordings="audios"
          ></recordings-list>

          selected: {{ selected }}
        </v-card-text>
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

import RecordingsList from '@/components/RecordingsList'
import CurrentTimer from '@/components/CurrentTimer'

const ENCODING_TYPE = 'mp3'
const ENCODE_AFTER_RECORD = true

export default {
  components: {
    RecordingsList,
    CurrentTimer
  },
  data() {
    return {
      availableDevices: [],
      selectedDevice: null,
      logData: '',
      isRecording: false,
      audios: [
        { isPlaying: false, duration: '01:45', volume: 50 },
        { isPlaying: false, duration: '01:23', volume: 50 },
        { isPlaying: false, duration: '00:21', volume: 50 },
        { isPlaying: false, duration: '00:13', volume: 50 }
      ],
      getUserMediaStream: null,
      recorder: null,
      input: null,
      audioContext: null,
      selected: null,
      timer: null
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
    toggleRecorder() {
      this.isRecording = !this.isRecording
      this.toggleTimer()
    },
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.interval)
        console.log('timer stops')
      } else {
        this.interval = setInterval(this.incrementTime, 1000)
      }
      this.isRunning = !this.isRunning
    },
    incrementTime() {
      this.timer = +this.timer + 1
    },
    stopTimer() {
      // reset the count
      this.timer = 0
      // and reset the timer
      clearInterval(this.interval)
      this.isRunning = false
    },
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

      this.stopTimer()

      //   // stop microphone access
      //   //! can't do this, otherwise can't record further notes

      //   // see https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/
      //   // I don't understand why they initialize the recording object
      //   // every single time a new recording is started 🤔
      //   this.getUserMediaStream.getAudioTracks()[0].stop()

      //   // tell the recorder to finish the recording (stop recording + encode the recorded audio)
      //   this.recorder.finishRecording()
      //   this.log('Recording stopped')
      // },
      // log(event) {
      //   this.logData += event + `<br>`
      // }
    }
  }
}
</script>
