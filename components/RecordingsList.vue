<template>
  <v-list elevation="5" shaped color="primary">
    <v-list-item-group
      v-model="selected"
      mandatory
      @change="$emit('input', selected)"
    >
      <v-list-item v-for="(recording, index) in recordings" :key="index">
        <v-list-item-avatar>
          <v-btn x-large icon @click="isPlaying = !isPlaying">
            <v-icon v-if="isPlaying">mdi-pause</v-icon>
            <v-icon v-else>mdi-play</v-icon>
          </v-btn>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="overline">
            Recording {{ index + 1 }}
          </v-list-item-title>
          {{ recording.duration }}
          <v-progress-linear
            value="45"
            active
            color="primary lighten-4"
            rounded
          />
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon color="primary darken-3" @click.stop>
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn icon x-small>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset></v-divider>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
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
      isPlaying: false
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
