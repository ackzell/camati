<template>
  <v-list elevation="5" shaped color="primary">
    <v-list-item-group
      v-model="selected"
      mandatory
      @change="$emit('input', selected)"
    >
      <div v-for="(recording, index) in recordings" :key="index">
        <recording-item :recording="recording" :index="index"></recording-item>
        <v-divider v-show="index != recordings.length - 1" inset></v-divider>
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
      selected: this.selectedItem
    }
  }
}
</script>

<style lang="scss" scoped>
.v-application--is-ltr .v-list-item__action:last-of-type:not(:only-child),
.v-application--is-ltr .v-list-item__avatar:last-of-type:not(:only-child),
.v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child) {
  margin-left: 0;
}
</style>
