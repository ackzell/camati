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
          <v-dialog v-model="confirmDialog">
            <v-card>
              <v-card-title primary-title>
                Confirm Remove
              </v-card-title>
              <v-card-text>
                Are you sure you want to delete this recording?
              </v-card-text>
              <v-card-actions>
                <v-btn color="success" @click="confirmDialog = false">
                  Cancel
                </v-btn>
                <v-btn color="error" @click="confirmDelete">
                  Delete Recording
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      recordingsInternal: this.recordings,
      confirmDialog: false,
      idToRemove: null
    }
  },
  methods: {
    remove(id) {
      // Save the id to remove so it is available to the confirmDelete method
      this.idToRemove = id
      // Show a confirm dialog before deleting recording
      this.confirmDialog = true
    },
    confirmDelete() {
      if (!this.idToRemove) {
        return
      }
      // close the confirm dialog
      this.confirmDialog = false
      // set the temporary storage of idToRemove back to null
      this.idToRemove = null

      // delete the recording
      const index = this.recordings.findIndex(
        (recording) => recording.id === this.idToRemove
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
