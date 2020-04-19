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

          <!-- Start  / Finish recording -->
          <v-btn
            :color="isRecording ? 'red' : 'primary darken-2'"
            @click="toggleRecorder"
          >
            <v-icon dark>{{
              isRecording ? 'mdi-stop' : 'mdi-microphone'
            }}</v-icon>
          </v-btn>

          <!-- discard recording -->
          <v-btn icon :disabled="!isRecording" @click="stopRecording">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <timer :timer-status="timerStatus"></timer>

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
import Timer from '@/components/Timer'

const ENCODING_TYPE = 'mp3'
const ENCODE_AFTER_RECORD = true

export default {
  components: {
    RecordingsList,
    Timer
  },
  data() {
    return {
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
      timerStatus: 'stopped'
    }
  },
  methods: {
    toggleRecorder() {
      this.isRecording = !this.isRecording
      this.timerStatus = this.isRecording ? 'started' : 'stopped'
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

            console.warn(
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
                console.warn('Loading ' + encoding + ' encoder...')
              },
              onEncoderLoaded: (recorder, encoding) => {
                // hide "loading encoder..." display
                console.warn(encoding + ' encoder loaded')
              },
              onComplete: (recorder, blob) => {
                console.warn('Encoding complete')
                const url = URL.createObjectURL(blob)
                this.audios.push(url)
                // createDownloadLink(blob, recorder.encoding);
              }
            })

            this.recorder.setOptions({
              timeLimit: 60,
              encodeAfterRecord: ENCODE_AFTER_RECORD,
              mp3: {
                bitRate: 160
              }
            })

            this.recorder.startRecording()
            console.warn('Recording started')
            this.isRecording = true
          })
          .catch((err) => {
            console.error('something went terribly wrong', err)
          })
      }
    },
    stopRecording() {
      this.isRecording = false
      this.timerStatus = 'stopped'

      //   // stop microphone access
      //   //! can't do this, otherwise can't record further notes

      //   // see https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/
      //   // I don't understand why they initialize the recording object
      //   // every single time a new recording is started 🤔
      //   this.getUserMediaStream.getAudioTracks()[0].stop()

      // tell the recorder to finish the recording (stop recording + encode the recorded audio)
      // this.recorder.finishRecording()
      // console.warn('Recording stopped')
      // },
      // log(event) {
      //   console.warnData += event + `<br>`
      // }
    }
  }
}
</script>
