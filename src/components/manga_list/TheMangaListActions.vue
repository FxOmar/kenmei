<template lang="pug">
  .ml-4.mt-2.flex-shrink-0
    template(v-if="$screen.lg && !$screen.touch")
      transition(name='slide' mode="out-in")
        div(key="bulk" v-if="selectionModeActive")
          bulk-actions.flex.mb-3.sm_mb-0(@click="$emit('click', $event)")
        div(key="actions" v-else)
          span.inline-flex.rounded-md.shadow-sm
            base-button(colour="success" @click="$emit('click', 'importManga')")
              icon-upload.-ml-1.mr-2.h-5.w-5
              | Import
          span.ml-3.inline-flex.rounded-md.shadow-sm
            base-button(@click="$emit('click', 'addManga')")
              icon-plus.-ml-1.mr-2.h-5.w-5
              | Add Manga
    template(v-else)
      base-fab.fixed.bottom-7.right-5.z-50(
        ref='editFab'
        v-if="selectionModeActive"
        @click="$emit('click', $event)"
        :options="editActions"
      )
        icon-edit-filled.w-6.h-6.text-white(style="padding: 1px 0 0 3px")
      base-fab.fixed.bottom-7.right-5.z-50(
        ref='addFab'
        v-else
        @click="$emit('click', $event)"
        :options="actions"
      )
        icon-plus.w-6.h-6.text-white
</template>

<script>
  import { mapGetters } from 'vuex';
  import BulkActions from './TheMangaListBulkActions.vue';

  export default {
    components: {
      BulkActions,
    },
    data() {
      return {
        actions: [
          { text: 'Add manga', icon: 'icon-plus', action: 'addManga' },
          { text: 'Import', icon: 'icon-upload', action: 'importManga' },
        ],
        editActions: [
          { text: 'Set chapter to last read', icon: 'icon-check-circle', action: 'bulkUpdate' },
          { text: 'Edit', icon: 'icon-edit', action: 'bulkEdit' },
          { text: 'Delete', icon: 'icon-trash', action: 'bulkDelete' },
          { text: 'Report', icon: 'icon-warning', action: 'bulkReport' },
        ],
      };
    },
    computed: {
      ...mapGetters('lists', [
        'selectionModeActive',
      ]),
    },
  };
</script>

<style lang="scss" scoped>
  .slide-enter-active,
  .slide-leave-active {
    @apply transition ease-in duration-300 transition-all overflow-hidden;
  }

  .slide-enter,
  .slide-leave-to {
    @apply opacity-0 transform translate-x-8;
  }
</style>
