<template lang="pug">
  .the-manga-list
    .the-manga-list-header
      .-ml-4.-mt-2.flex.items-center.justify-between.flex-wrap.sm_flex-no-wrap
        manga-list-header.ml-4.mt-2.sm_ml-2
        actions(@click="$emit($event)")
    ul.divide-y.divide-gray-200
      template(v-if="hasEntries")
        li.transition.duration-150.ease-in-out(
          v-for="(item, index) in entries"
          :key="item.id"
        )
          manga-list-row(
            :item="item"
            @editEntry="$emit('editEntry', $event)"
            @deleteEntry="$emit('deleteEntry')"
          )
      template(v-else)
        template(v-if="entriesLoading")
          li(v-for="index in 2" :key="index")
            a.block.relative
              .flex.items-center.px-4.py-4
                base-form-checkbox.h-5.w-4.hidden.sm_flex(
                  :value='false'
                  :disabled='true'
                )
                manga-list-row-skeleton
        li(v-else)
          a.block.text-center
            .flex.items-center.justify-center.px-4.py-12.sm_px-6
              .text-base.leading-5.font-medium.text-gray-500
                template(v-if='filtersApplied')
                  | No entries found.
                  | Try changing your filters
                .space-y-3(v-else)
                  p You haven't imported any series yet.
                  p
                    | Press Add Manga to search for series or alternatively
                    | provide a URL for one of our supported sites
                  p
                    | You can also press Import to get your series from
                    | TrackrMoe or MangaDex
    .the-manga-list-footer(v-if="hasEntries")
      .-ml-4.-mt-2.flex.items-center.justify-between.flex-wrap.sm_flex-no-wrap
        manga-list-footer.ml-4.mt-2.sm_ml-2(
          @pageChanged="$emit('pageChanged', $event)"
        )
</template>

<script>
  import { mapState } from 'vuex';

  import Actions from './TheMangaListActions.vue';
  import MangaListRow from './TheMangaListRow.vue';
  import MangaListRowSkeleton from './TheMangaListRowSkeleton.vue';
  import MangaListHeader from './TheMangaListHeader.vue';
  import MangaListFooter from './TheMangaListFooter.vue';

  export default {
    components: {
      Actions,
      MangaListRow,
      MangaListRowSkeleton,
      MangaListHeader,
      MangaListFooter,
    },
    props: {
      filtersApplied: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapState('lists', [
        'entries',
        'entriesLoading',
      ]),
      hasEntries() {
        return this.entries.length;
      },
    },
  };
</script>

<style media="screen" lang="scss" scoped>
  .the-manga-list {
    @apply bg-white shadow-lg overflow-hidden border border-gray-100;

    @screen sm {
      @apply rounded-md;
    }
  }

  .the-manga-list-header {
    @apply border-b border-gray-200 px-4 py-5;

    @screen sm {
      @apply px-6;
    }
  }

  .the-manga-list-footer {
    @apply border-t border-gray-200 px-4 py-5;

    @screen sm {
      @apply px-6;
    }
  }
</style>
