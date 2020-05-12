<template>
  <v-list elevation="5" shaped color="primary">
    <v-list-item-group
      v-model="selected"
      mandatory
      @change="$emit('input', selected)"
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
      type: Number,
      default: null
    },
    recordings: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selected: this.selectedItem,
      recordingsInternal: this.recordings
    }
  },
  methods: {
    remove(id) {
      const index = this.recordings.findIndex(
        (recording) => recording.id === id
      )

      this.recordingsInternal.splice(index, 1)
    }
  }
}
</script>
