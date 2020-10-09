<template lang="pug">
  .flex.items-center.w-full
    .h-5.w-4.hidden.sm_block
    .sm_pl-10.w-full
      .flex-1.flex.justify-center.sm_items-center.sm_justify-between.w-full
        .animate-pulse.flex.space-x-4.w-48.hidden.sm_flex(v-if="entriesLoading")
          .flex-1.space-y-4.py-1
            .h-3.bg-gray-400.rounded
        p.text-sm.leading-5.text-gray-700(v-else-if="selectionModeActive")
          | Selected
          |
          span.font-medium(v-text="selectedEntries.length")
          |
          |  entries
        base-pagination-info.hidden.sm_flex(
          v-else-if="entriesPagy"
          :pagy="entriesPagy"
        )
        base-pagination-pager(
          :pagy="entriesPagy"
          :loading="entriesLoading"
          :class="{ 'visible': pagerVisible, 'invisible': !pagerVisible }"
          @pageChanged="$emit('pageChanged', $event)"
        )
</template>

<script>
  import { mapState, mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapState('lists', [
        'selectedEntries',
        'entriesPagy',
        'entriesLoading',
      ]),
      ...mapGetters('lists', [
        'selectionModeActive',
      ]),
      pagerVisible() {
        return this.entriesPagy.pages > 1;
      },
    },
  };
</script>
