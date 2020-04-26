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
            v-model="selected"
            :recordings="recordings"
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
          <v-btn color="primary" :disabled="!recordings.length && !selected"
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
      selected: null,
      timerStatus: 'stopped',
      recordings: [],
      count: 0,
      TIME_LIMIT: 60
    }
  },
  created() {
    console.log(typeof WebAudioRecorder)
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
                const url = URL.createObjectURL(blob)
                // the url already gives us a unique id, so we might as well use that :D
                const id = url.split('3333/')[1]
                this.recordings.push({
                  number: ++this.count,
                  id,
                  audio: url,
                  encoding: ENCODING_TYPE
                })
              },
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

      //   // stop microphone access
      //   //! can't do this, otherwise can't record further notes

      //   // see https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/
      //   // I don't understand why they initialize the recording object
      //   // every single time a new recording is started 🤔
      this.getUserMediaStream.getAudioTracks()[0].stop()

      // tell the recorder to finish the recording (stop recording + encode the recorded audio)
      this.recorder.finishRecording()
      console.warn('Recording stopped')
      // },
      // log(event) {
      //   console.warnData += event + `<br>`
      // }
    }
  },
  head() {
    return {
      script: [{ src: '/WebAudioRecorder.js', defer: true }]
    }
  }
}
</script>
