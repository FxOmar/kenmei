<template lang="pug">
  a.list-row.group(
    :class="classes"
    v-touch:touchhold="selectEntry"
    v-touch="editModeSelection"
    v-touch-options="{ touchClass: 'touch-fill' }"
  )
    .flex.items-center.px-4.py-4
      base-form-checkbox.h-5.w-4(
        :value='itemSelected'
        :disabled='entriesLoading'
        :class='checkBoxClasses'
        @input="selectEntry"
      )
      row-skeleton(v-if="entriesLoading || itemLoading")
      template(v-else)
        span.relative(:class="pingClasses")
          span(v-if="!item.attributes.unread")
          template(v-else)
            span.unread-indicator-ping
            span.unread-indicator
        row-body(:item="item")
        .actions
          .row-actions.group-hover_opacity-100.opacity-0(v-if="$screen.lg && !$screen.touch")
            base-icon-button-group(
              :buttons="dropdownItems"
              @click="handleClick"
            )
          base-dropdown(
            v-else
            size="lg"
            :items="dropdownItems"
            :class="{ 'visible': !selectionModeActive, 'invisible': selectionModeActive }"
            @click="handleClick"
          )
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import { Message } from 'element-ui';

  import { updateMangaEntry } from '@/services/api';

  import RowBody from './TheMangaListRowBody.vue';
  import RowSkeleton from './TheMangaListRowSkeleton.vue';

  export default {
    components: {
      RowBody,
      RowSkeleton,
    },
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    computed: {
      ...mapState('lists', [
        'selectedEntries',
        'entriesLoading',
        'entriesUpdating',
        'checkboxToggled',
      ]),
      ...mapGetters('lists', [
        'selectionModeActive', // TODO: Re-render culprit
      ]),
      classes() {
        return {
          'sm_hover_bg-gray-50': !this.itemSelected,
          'bg-blue-100 bg-opacity-50': this.itemSelected,
        };
      },
      checkBoxClasses() {
        return {
          'hidden sm_flex': !this.selectionModeActive,
          flex: this.selectionModeActive,
        };
      },
      pingClasses() {
        return {
          'ml-1.5 w-2.5 h-2.5 flex sm_ml-4': true,
          'ml-4 hidden sm_flex': this.selectionModeActive,
        };
      },
      itemSelected() {
        return this.selectedEntries.includes(this.item) && this.checkboxToggled;
      },
      itemLoading() {
        return this.selectedEntries.includes(this.item) && this.entriesUpdating;
      },
      lastReadTranslation() {
        const { last_chapter_available, unread } = this.item.attributes;

        if (unread) return 'read';
        if (!last_chapter_available) return 'lastReadNotAvailable';

        return 'lastReadLatest';
      },
      dropdownItems() {
        return [
          {
            text: this.$t(`entries.${this.lastReadTranslation}`),
            icon: 'IconCheckCircle',
            colour: 'success',
            disabled: ['lastReadNotAvailable', 'lastReadLatest'].includes(this.lastReadTranslation),
          },
          {
            text: 'Edit',
            icon: 'IconEdit',
            colour: 'primary',
          },
          {
            text: 'Delete',
            icon: 'IconTrash',
            colour: 'danger',
          },
        ];
      },
      updateAttributes() {
        return {
          last_volume_read: this.item.attributes.last_volume_available,
          last_chapter_read: this.item.attributes.last_chapter_available,
          last_chapter_read_url: this.item.links.last_chapter_available_url,
        };
      },
      // TODO: Duplicated, needs extracting into a singular place
      lastReadChapterInfo() {
        const { last_volume_read, last_chapter_read } = this.updateAttributes;
        const chapterNumber = parseFloat(last_chapter_read);

        if (last_volume_read && last_volume_read !== '0') {
          return `Vol. ${last_volume_read} Ch. ${last_chapter_read}`;
        }

        // TODO: Replace when we return titles separately from the chapter
        if (Number.isNaN(chapterNumber)) return last_chapter_read;

        return `Ch. ${last_chapter_read}`;
      },
    },
    methods: {
      ...mapMutations('lists', [
        'updateEntry',
        'addSelectedEntry',
        'setSelectedEntries',
        'setEntriesUpdating',
      ]),
      editModeSelection(e) {
        if (!this.selectionModeActive) return;

        e.preventDefault();

        this.selectEntry(!this.selectedEntries.includes(this.item));
      },
      selectEntry(selected) {
        if (selected) {
          if (this.selectedEntries.includes(this.item)) return;

          this.addSelectedEntry({ entry: this.item, isCheckbox: true });
        } else {
          const entries = this.selectedEntries.filter((e) => e !== this.item);
          const stillToggled = !!entries.length;

          this.setSelectedEntries({ entries, isCheckbox: stillToggled });
        }
      },
      async setLastRead() {
        this.addSelectedEntry({ entry: this.item, isCheckbox: false });
        this.setEntriesUpdating(true);

        const { id } = this.item;

        const response = await updateMangaEntry(id, this.updateAttributes);
        if (response) {
          Message.info(`Updated last read to ${this.lastReadChapterInfo}`);
          this.updateEntry(response);
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }

        this.setEntriesUpdating(false);
        this.setSelectedEntries({ entries: [], isCheckbox: false });
      },
      handleClick(action) {
        if (action === 'Edit') {
          this.$emit('editEntry', this.item);
        } else if (action === 'Set chapter to last read') {
          this.setLastRead();
        } else if (action === 'Delete') {
          this.addSelectedEntry({ entry: this.item, isCheckbox: false });
          this.$emit('deleteEntry');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .list-row {
    @apply block relative;

    &:focus {
      @apply outline-none bg-gray-50;
    }
  }

  .touch-fill {
    @apply transition duration-300 bg-blue-100 bg-opacity-50;
  }

  .row-actions {
    @apply absolute;

    top: -16px;
    right: 10px;
  }

  .unread-indicator {
    @apply relative inline-flex rounded-full bg-blue-500 w-2.5 h-2.5;
  }
  .unread-indicator-ping {
    @apply animate-ping absolute inline-flex h-full w-full;
    @apply rounded-full bg-blue-400 opacity-75;
  }
</style>
