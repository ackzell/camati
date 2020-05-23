<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" lg="4">
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
                :disabled="recordings.length === 3 || !canRecord"
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
            large
            color="primary"
            :disabled="(!recordings.length && !selected) || !name || sending"
            @click="send"
            >{{ sending ? 'Sending...' : 'Send it!' }}</v-btn
          >
        </v-card-actions>
        <v-progress-linear
          v-if="uploadProgress"
          :value="uploadProgress"
        ></v-progress-linear>
      </v-card>
    </v-col>
    <v-snackbar
      v-model="snackbar"
      :timeout="0"
      top
      :color="snackbarError ? 'red accent-4' : 'green darken-2'"
      multi-line
      vertical
    >
      <span v-html="snackbarText"></span>
      <v-btn text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
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
      canRecord: false,
      name: '',
      isRecording: false,
      getUserMediaStream: null,
      recorder: null,
      input: null,
      audioContext: null,
      selected: null,
      timerStatus: 'stopped',
      recordings: [],
      count: 0,
      TIME_LIMIT: 60,
      sending: false,
      uploadProgress: 0,
      snackbar: false,
      snackbarText: '',
      snackbarError: false
    }
  },
  created() {
    // get access to the mic
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true
        })
        .then((stream) => {
          // and until we do, enable the recording button
          this.canRecord = true
        })
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
                const url = URL.createObjectURL(blob)

                this.recordings.push({
                  number: ++this.count,
                  id: getId(url), // the url already gives us a unique id, so we might as well use that :D
                  audio: url,
                  blob,
                  encoding: ENCODING_TYPE
                })

                function getId(url) {
                  const href = url.replace('blob:', '')
                  const parser = document.createElement('a')

                  parser.href = href
                  return parser.pathname.substring(1)
                }
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

      this.getUserMediaStream.getAudioTracks()[0].stop()

      // tell the recorder to finish the recording (stop recording + encode the recorded audio)
      this.recorder.finishRecording()
      console.warn('Recording stopped')
    },
    send() {
      this.snackbar = false
      this.sending = true
      const selectedTrack = this.recordings[this.selected]
      const storageRef = this.$fireStorage.ref()
      const today = new Date().toLocaleDateString('es-MX').replace(/\//g, '-')
      const audioRef = storageRef.child(
        `${today}/${this.name}-${selectedTrack.id}`
      )

      const uploadTask = audioRef.put(selectedTrack.blob)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          this.uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        () => {
          // error
          this.snackbar = true
          this.snackbarError = true
          this.snackbarText = 'There was an error, please try again 😖'
        },
        () => {
          // success
          this.sending = false
          this.uploadProgress = 0

          this.snackbar = true
          this.snackbarText =
            "Your audio was uploaded! <br> We'll make sure to add it in the next available spot in the newsletter 😎"
        }
      )
    }
  },
  head() {
    return {
      script: [{ src: '/WebAudioRecorder.js', defer: true }]
    }
  }
}
</script>
