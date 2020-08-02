<template>
  <v-list elevation="0" shaped color="primary">
    <v-list-item-group
      v-model="selected"
      class="py-0"
      group
      mandatory
      @change="$emit('input', selected)"
    >
      <v-slide-y-transition group>
        <div
          v-for="(recording, index) in recordingsInternal"
          :key="recording.id"
        >
          <recording-item
            :recording="recording"
            @remove-item="remove(recording.id)"
          ></recording-item>
          <v-divider
            v-if="index !== recordingsInternal.length - 1"
            inset
          ></v-divider>
        </div>
      </v-slide-y-transition>
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
      default: 0
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
      if (!confirm('Are you sure you want to remove this record?')) {
        return
      }
      const index = this.recordings.findIndex(
        (recording) => recording.id === id
      )

      this.recordingsInternal.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
.v-move {
  transition: transform 1s;
}
</style>
