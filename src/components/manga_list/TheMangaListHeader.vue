<template lang="pug">
  .flex.items-center
    base-form-checkbox.h-5.w-4.sm_visible(
      v-if="entriesLoading || entriesPagy.count"
      :value="selectAllChecked"
      :indeterminate="indeterminate"
      :disabled="entriesLoading"
      :class="checkBoxClasses"
      @input="selectAll"
    )
    .pl-4.sm_pl-10
      .animate-pulse.flex.space-x-4.w-48(v-if="entriesLoading")
        .flex-1.space-y-4.py-1
          .h-3.bg-gray-400.rounded
      template(v-else)
        p.text-sm.leading-5.text-gray-700(v-if="selectionModeActive")
          | Selected
          |
          span.font-medium(v-text="selectedEntries.length")
          |
          |  entries
        base-pagination-info(v-else-if="entriesPagy.count" :pagy="entriesPagy")
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex';

  export default {
    computed: {
      ...mapState('lists', [
        'entries',
        'selectedEntries',
        'entriesPagy',
        'entriesLoading',
      ]),
      ...mapGetters('lists', [
        'selectionModeActive',
      ]),
      selectAllChecked() {
        return this.selectionModeActive && !this.indeterminate;
      },
      indeterminate() {
        return this.selectionModeActive
          && this.selectedEntries.length !== this.entriesPagy.items;
      },
      checkBoxClasses() {
        return {
          invisible: !this.selectionModeActive,
          visible: this.selectionModeActive,
        };
      },
    },
    methods: {
      ...mapMutations('lists', [
        'setSelectedEntries',
      ]),
      selectAll(state) {
        if (this.indeterminate || state) {
          this.setSelectedEntries({ entries: this.entries, isCheckbox: true });
        } else {
          this.setSelectedEntries({ entries: [], isCheckbox: false });
        }
      },
    },
  };
</script>
