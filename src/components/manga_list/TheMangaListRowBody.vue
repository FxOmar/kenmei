<template lang="pug">
  .row-body
    .min-w-0.flex-1.px-4.lg_grid.lg_grid-cols-8.lg_gap-4
      .relative.col-span-3.lg_flex.lg_min-w-0.lg_items-center
        a.text-sm.font-medium.leading-5.text-gray-700.select-auto.hover_text-blue-600.lg_truncate(
          ref="titleLink"
          :href="item.links.series_url"
          :content="title"
          target="_blank"
          rel="noreferrer"
          v-text="title"
          v-tippy="tippyConfig"
        )
      .flex.col-span-1.mt-2.sm_mt-0
        .text-sm.font-normal.leading-5.text-gray-900.items-center.flex
          base-badge(:type="entryType")
            | {{ entryStatusName }}
      .col-span-2.inline-block.mt-2.mr-1.sm_m-0.sm_block
        chapter(
          :chapter="lastChapterRead"
          :volume="lastVolumeRead"
          :url="item.links.last_chapter_read_url"
        )
        .mt-2.flex.items-center.text-sm.leading-5.text-gray-500(v-if="$screen.lg")
          icon-calendar.flex-shrink-0.h-5.w-5.text-gray-400(class='mr-1.5')
          span
            time(
              v-if="item.attributes.last_read_at"
              :title='formatTime(item.attributes.last_read_at)'
              :datetime='item.attributes.last_read_at'
            )
              | Read {{ item.attributes.last_read_at | timeAgo }}
            template(v-else-if='item.attributes.last_chapter_read')
              | Last read is unknown
            template(v-else)
              | Haven't read yet
      .col-span-2.inline-block.sm_block
        chapter(
          :chapter="lastChapterAvailable"
          :volume="lastVolumeAvailable"
          :url="item.links.last_chapter_available_url"
          type='released'
        )
        .mt-2.flex.items-center.text-sm.leading-5.text-gray-500(v-if="$screen.lg")
          icon-calendar.flex-shrink-0.h-5.w-5.text-gray-400(class='mr-1.5')
          span
            time(
              v-if="item.attributes.last_released_at"
              :title='formatTime(item.attributes.last_released_at)'
              :datetime='item.attributes.last_released_at'
            )
              | Released {{ item.attributes.last_released_at | timeAgo }}
            template(v-else)
              | Last Released is unknown
</template>

<script>
  import { mapState } from 'vuex';
  import he from 'he';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import localizedFormat from 'dayjs/plugin/localizedFormat';

  import Chapter from './TheMangaListRowBodyChapter.vue';

  dayjs.extend(relativeTime);
  dayjs.extend(localizedFormat);

  export default {
    components: {
      Chapter,
    },
    filters: {
      timeAgo(datetime) {
        const relative = dayjs().to(dayjs(datetime));

        // TODO: I should evalute if I can update configuration directly
        // https://day.js.org/docs/en/customization/relative-time
        if (['in a few seconds', 'a few seconds ago'].includes(relative)) {
          return 'just now';
        }

        return relative;
      },
    },
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        tippyConfig: {
          placement: 'top-center',
          interactive: true,
          allowHTML: false,
          onShow: () => this.tippyEnabled,
        },
      };
    },
    computed: {
      ...mapState('lists', [
        'statuses',
      ]),
      title() {
        return he.decode(this.item.attributes.title);
      },
      lastVolumeRead() {
        return this.item.attributes.last_volume_read;
      },
      lastChapterRead() {
        return this.item.attributes.last_chapter_read;
      },
      lastVolumeAvailable() {
        return this.item.attributes.last_volume_available;
      },
      lastChapterAvailable() {
        return this.item.attributes.last_chapter_available;
      },
      entryStatusName() {
        return this.statuses.find(
          (s) => s.enum === this.item.attributes.status,
        ).name;
      },
      entryType() {
        const { status } = this.item.attributes;

        return {
          1: 'success', 2: 'warning', 3: 'warning-light', 5: 'danger',
        }[status];
      },
      tippyEnabled() {
        if (!this.$screen.lg || this.$screen.touch) return;

        const { titleLink } = this.$refs;

        return titleLink.scrollWidth > titleLink.clientWidth;
      },
    },
    methods: {
      formatTime(datetime) {
        return dayjs(datetime).format('lll');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .row-body {
    @apply min-w-0 flex-1 flex items-center select-none;
  }
</style>
