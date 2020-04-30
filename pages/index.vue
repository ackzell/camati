<template>
  <v-row align="center" justify="center">
    <v-col cols="8">
      <p class="caption text-right">
        You can record a quick message (up to 1 min) and send it to us!
      </p>
      <v-card class="elevation-12">
        <v-toolbar color="primary" flat>
          <v-toolbar-title>VoiceMail</v-toolbar-title>
          <v-spacer></v-spacer>

          <!-- Start  / Finish recording -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                :color="isRecording ? 'red' : 'primary darken-2'"
                :disabled="recordings.length === 3"
                @click="toggleRecorder"
                v-on="on"
              >
                <v-icon dark>{{
                  isRecording ? 'mdi-stop' : 'mdi-microphone'
                }}</v-icon>
              </v-btn>
            </template>
            <span v-if="!isRecording">Start recording</span>
            <span v-else>Finish recording</span>
          </v-tooltip>

          <!-- discard recording -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                :disabled="!isRecording"
                @click="cancelRecording"
                v-on="on"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Discard recording</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text>
          <timer :timer-status="timerStatus" :time-limit="TIME_LIMIT"></timer>

          <recordings-list
            v-if="recordings.length"
            v-model="selectedRecording"
            :recordings="recordings"
          ></recordings-list>
        </v-card-text>
      </v-card>

      <v-card class="mt-4">
        <v-card-text>
          <v-text-field
            v-model="name"
            name="name"
            label="Your Name"
            single-line
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!selectedRecording || !name"
            @click="sendRecording"
            >Send it!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
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
      getUserMediaStream: null,
      recorder: null,
      input: null,
      audioContext: null,
      selectedRecording: null,
      timerStatus: 'stopped',
      recordings: [],
      count: 0,
      TIME_LIMIT: 60,
      name: '',
      blob: null
    }
  },
  methods: {
    toggleRecorder() {
      this.isRecording = !this.isRecording
      this.timerStatus = this.isRecording ? 'started' : 'stopped'
      if (this.isRecording) {
        this.startRecording()
      } else {
        this.stopRecording()
      }
    },
    cancelRecording() {
      this.timerStatus = 'stopped'
      this.isRecording = false
    },
    startRecording() {
      if (navigator && navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({
            audio: true
          })
          .then((stream) => {
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

            this.recorder = new window.WebAudioRecorder(this.input, {
              workerDir: 'js/WebAudioRecorder/',
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
                this.blob = blob
                const url = URL.createObjectURL(blob)
                // the url already gives us a unique id, so we might as well use that :D
                const id = url.split('3000/')[1]
                const recording = {
                  number: ++this.count,
                  id,
                  audio: url,
                  encoding: ENCODING_TYPE
                }
                this.recordings.push(recording)
              },
              // stop the recording when time is up
              onTimeout: this.stopRecording
            })

            this.recorder.setOptions({
              timeLimit: this.TIME_LIMIT,
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

      // stop microphone access
      // see https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/
      this.getUserMediaStream.getAudioTracks()[0].stop()

      // tell the recorder to finish the recording (stop recording + encode the recorded audio)
      this.recorder.finishRecording()
      console.warn('Recording stopped')
    },
    sendRecording() {
      const oReq = new XMLHttpRequest()
      oReq.open('POST', '/.netlify/functions/store_file', true)
      oReq.onload = function(oEvent) {
        // Uploaded.
        console.log('uploaded')
      }

      const blob = new Blob(this.blob, { type: 'text/plain' })

      oReq.send(blob)

      // console.log(process.env)

      // const oReq = new XMLHttpRequest()
      // oReq.open('GET', '/.netlify/functions/store_file')
      // oReq.onload = function(response) {}

      // oReq.send()
    }
  },
  head() {
    return {
      script: [{ src: '/WebAudioRecorder.js', defer: true }]
    }
  }
}
</script>
