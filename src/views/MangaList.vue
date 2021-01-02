<template lang="pug">
  .flex.flex-col.items-center
    .hidden.bg-white.h-48.w-full.absolute.border-b.border-gray-200.sm_block
    .flex.flex-col.w-full.max-w-7xl.pt-8.sm_py-8
      manga-list-actions(
        :selectedStatus.sync="selectedStatus"
        :selectedTagIDs.sync="selectedTagIDs"
        :debouncedSearchTerm.sync="debouncedSearchTerm"
        @sortApplied="applySort($event)"
        @resetSearch="searchTerm = ''"
      )
      .flex-grow.sm_mx-5.mx-0.z-10
        the-manga-list(
          ref='mangaList'
          :filtersApplied='filtersApplied'
          @editEntry='showEditEntryDialog'
          @deleteEntry='deleteEntries'
          @importManga='importDialogVisible = true'
          @addManga='dialogVisible = true'
          @bulkDelete='deleteEntries'
          @bulkEdit='editDialogVisible = true'
          @bulkUpdate='updateEntries'
          @bulkReport='reportDialogVisible = true'
          @pageChanged="changePage($event)"
        )
      importers(
        :visible='importDialogVisible'
        @closeDialog="importDialogVisible = false"
      )
      add-manga-entry(
        ref='addMangaEntryModal'
        :visible="dialogVisible"
        :currentStatus="selectedStatus"
        @dialogClosed='dialogVisible = false'
        @entry-added='updatePagy'
      )
      edit-manga-entries(
        ref='editMangaEntryModal'
        :visible='editDialogVisible'
        @editComplete="resetEntries('editDialogVisible')"
      )
      delete-manga-entries(
        :visible='deleteDialogVisible'
        @dialogClosed='deleteDialogVisible = false'
        @confirmDeletion='deleteDialogVisible = false; removeSeries()'
      )
      report-manga-entries(
        :visible='reportDialogVisible'
        @closeDialog="resetEntries('reportDialogVisible')"
      )
</template>

<script>
  import VueScrollTo from 'vue-scrollto';
  import debounce from 'lodash/debounce';
  import isEqual from 'lodash/isEqual';
  import { Message } from 'element-ui';
  import {
    mapActions, mapState, mapGetters, mapMutations,
  } from 'vuex';

  import Importers from '@/components/TheImporters';
  import AddMangaEntry from '@/components/manga_entries/AddMangaEntry';
  import DeleteMangaEntries from '@/components/manga_entries/DeleteMangaEntries';
  import EditMangaEntries from '@/components/manga_entries/EditMangaEntries';
  import ReportMangaEntries from '@/components/manga_entries/ReportMangaEntries';
  import TheMangaList from '@/components/manga_list/TheMangaList';
  import MangaListActions from '@/components/MangaListActions';
  import { bulkDeleteMangaEntries } from '@/services/api';
  import { update } from '@/services/endpoints/manga_entries_collections';

  export default {
    name: 'MangaList',
    components: {
      Importers,
      AddMangaEntry,
      EditMangaEntries,
      DeleteMangaEntries,
      ReportMangaEntries,
      TheMangaList,
      MangaListActions,
    },
    data() {
      return {
        selectedTagIDs: [],
        selectedSort: { Unread: 'desc' },
        selectedStatus: 1,
        searchTerm: '',
        dialogVisible: false,
        importDialogVisible: false,
        editDialogVisible: false,
        deleteDialogVisible: false,
        reportDialogVisible: false,
      };
    },
    computed: {
      ...mapState('lists', [
        'entries',
        'selectedEntries',
        'entriesPagy',
        'tags',
        'statuses',
      ]),
      ...mapGetters('lists', [
        'selectedEntriesIDs',
      ]),
      trackedEntriesIDs() {
        const trackedIDs = this.selectedEntries.map(
          (entry) => entry.attributes.tracked_entries.map(
            (trackedEntry) => trackedEntry.id,
          ),
        );

        return [].concat(...trackedIDs);
      },
      debouncedSearchTerm: {
        get() {
          return this.searchTerm;
        },
        set: debounce(function(newVal) { //eslint-disable-line
          if (newVal !== this.searchTerm) { this.searchTerm = newVal; }
        }, 350),
      },
      filters() {
        return {
          status: this.selectedStatus,
          tagIDs: this.selectedTagIDs,
          searchTerm: this.searchTerm.toLowerCase(),
        };
      },
      filtersApplied() {
        return !isEqual(this.filters, { status: 1, tagIDs: [], searchTerm: '' });
      },
    },
    watch: {
      async filters(newFilters) {
        this.setTagsLoading(true);

        await this.getEntries({
          page: 1,
          ...newFilters,
          sort: this.selectedSort,
        });

        this.setTagsLoading(false);
      },
    },
    async created() {
      this.setTagsLoading(true);

      this.setSelectedEntries({ entries: [], isCheckbox: false });

      await this.getTags();
      await this.getEntries({ page: 1, status: 1 });

      this.setTagsLoading(false);
    },
    mounted() {
      VueScrollTo.scrollTo('#home');
    },
    methods: {
      ...mapActions('lists', [
        'getTags',
        'getEntries',
        'getEntriesPagy',
      ]),
      ...mapMutations('lists', [
        'setSelectedEntries',
        'setTagsLoading',
        'setEntriesUpdating',
        'updateEntry',
      ]),
      deleteEntries() {
        if (this.trackedEntriesIDs.length > this.selectedEntriesIDs.length) {
          this.deleteDialogVisible = true;
        } else {
          this.removeSeries();
        }
      },
      async removeSeries() {
        this.setEntriesUpdating(true);

        const successful = await bulkDeleteMangaEntries(this.trackedEntriesIDs);

        if (successful) {
          Message.info(`${this.trackedEntriesIDs.length} entries deleted`);
          await this.changePage(this.entriesPagy.page);
        } else {
          Message.error(
            'Deletion failed. Try reloading the page before trying again',
          );
        }

        this.setEntriesUpdating(false);
      },
      async updateEntries() {
        this.setEntriesUpdating(true);

        const attributes = this.selectedEntries.map((entry) => ({
          id: entry.id,
          last_volume_read: entry.attributes.last_volume_available,
          last_chapter_read: entry.attributes.last_chapter_available,
          last_chapter_read_url: entry.links.last_chapter_available_url,
        }));

        const response = await update(attributes);
        const { status, data } = response;

        if (status === 200) {
          data.data.map((e) => this.updateEntry(e));
          Message.info(`Updated ${attributes.length} entries`);
          this.resetSelectedAttributes();
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }

        this.setEntriesUpdating(false);
      },
      async changePage(page) {
        this.setTagsLoading(true);

        await this.getEntries({
          page,
          ...this.filters,
          sort: this.selectedSort,
        });

        this.setTagsLoading(false);
      },
      async applySort(sort) {
        this.setTagsLoading(true);

        this.selectedSort = sort;
        await this.getEntries({ page: 1, ...this.filters, sort });

        this.setTagsLoading(false);
      },
      async updatePagy() {
        await this.getEntriesPagy({
          page: this.entriesPagy.page,
          ...this.filters,
          sort: this.selectedSort,
        });

        this.dialogVisible = false;
      },
      resetEntries(dialogName) {
        this[dialogName] = false;
        this.resetSelectedAttributes();
      },
      resetSelectedAttributes() {
        this.setSelectedEntries({ entries: [], isCheckbox: false });
      },
      showEditEntryDialog(entry) {
        this.setSelectedEntries({ entries: [entry], isCheckbox: false });
        this.editDialogVisible = true;
      },
    },
  };
</script>

<style media="screen" lang="scss">
  .el-input__inner {
    @apply rounded-md;
  }
</style>
