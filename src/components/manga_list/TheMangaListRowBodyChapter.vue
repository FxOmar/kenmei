<template lang="pug">
  a(:href='url' target='_blank' rel="noreferrer")
    base-badge(:icon="icon" :class="classes" type='custom')
      | {{ chapterInfo }}
</template>

<script>
  export default {
    props: {
      chapter: {
        type: String,
        default: '',
      },
      volume: {
        type: String,
        default: '',
      },
      url: {
        type: String,
        default: '#',
      },
      type: {
        type: String,
        default: 'current',
        validator: (value) => ['current', 'released'].includes(value),
      },
    },
    computed: {
      icon() {
        if (this.$screen.lg) return;

        return this.type === 'current' ? 'IconBookmark' : 'IconBell';
      },
      noChapter() {
        return ['No chapters read', 'No chapters available']
          .includes(this.chapterInfo);
      },
      classes() {
        return {
          'bg-blue-100 text-blue-800 hover_bg-blue-200 hover_text-blue-700': !this.noChapter,
          'bg-gray-200 text-gray-800': this.noChapter,
        };
      },
      chapterInfo() {
        if (this.chapter) {
          const chapterNumber = parseFloat(this.chapter);
          const isTitle = Number.isNaN(chapterNumber);

          if (this.volume && this.volume !== '0' && !isTitle) {
            return `Vol. ${this.volume} Ch. ${this.chapter}`;
          }

          // TODO: Replace when we return titles separately from the chapter
          if (isTitle) return this.chapter;

          return `Ch. ${this.chapter}`;
        }

        return this.type === 'current' ? 'No chapters read' : 'No chapters available';
      },
    },
  };
</script>
