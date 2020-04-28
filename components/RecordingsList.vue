<template>
  <v-list elevation="5" shaped color="primary">
    <v-list-item-group
      v-model="selected"
      mandatory
      @change="
        $emit(
          'input',
          recordingsInternal[selected] ? recordingsInternal[selected].id : null
        )
      "
    >
      <div v-for="(recording, index) in recordingsInternal" :key="recording.id">
        <recording-item
          :recording="recording"
          @remove-item="remove(recording.id)"
        ></recording-item>
        <v-divider
          v-show="index != recordingsInternal.length - 1"
          inset
        ></v-divider>
      </div>
    </v-list-item-group>
  </v-list>
</template>

<script>
import RecordingItem from '@/components/RecordingItem'
export default {
  components: {
    RecordingItem
  },
  props: {
    value: {
      type: String,
      default: null
    },
    recordings: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selected: null,
      recordingsInternal: this.recordings
    }
  },
  methods: {
    remove(id) {
      const index = this.recordings.findIndex(
        (recording) => recording.id === id
      )
      if (this.selected === index) {
        this.$emit('input', null)
      }
      this.recordingsInternal.splice(index, 1)
    }
  }
}
</script>
