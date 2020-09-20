<template lang="pug">
  nav.relative.z-0.inline-flex.shadow-sm.rounded-l-md
    a.px-2.py-1.rounded-l-md.text-gray-500.hover_text-gray-400.border-l(
      href='javascript:void(0)'
      aria-label='Previous'
      :class="{ 'cursor-not-allowed': !pagy.prev }"
      @click.prevent="changePage(pagy.prev)"
    )
      icon-chevron-left.h-5.w-5(:class="{ 'opacity-50': !pagy.prev }")
    template(v-for="page in pagy.series")
      a.-ml-px.px-4.py-1.text-gray-700(
        href='javascript:void(0)'
        v-if="page !== 'gap'"
        v-text="page"
        @click.prevent="changePage(page)"
        :class="paginationClasses(page)"
      )
      span.gap(v-else)
        | …
    a.-ml-px.px-2.py-1.rounded-r-md.text-gray-500.hover_text-gray-400.border-r(
      href='javascript:void(0)'
      aria-label='Next'
      :class="{ 'cursor-not-allowed': !pagy.next }"
      @click.prevent="changePage(pagy.next)"
    )
      icon-chevron-right.h-5.w-5(:class="{ 'opacity-50': !pagy.next }")
</template>

<script>
  export default {
    props: {
      pagy: {
        type: Object,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        currentPage: null,
      };
    },
    computed: {
      currentPagyPage() {
        const page = this.pagy.series.find(
          (page) => !Number.isInteger(page) && page !== 'gap',
        );

        return Number.parseInt(page, 10);
      },
    },
    mounted() {
      this.currentPage = this.currentPagyPage;
    },
    updated() {
      if (this.loading || this.currentPagyPage === this.currentPage) return;

      this.currentPage = this.currentPagyPage;
    },
    methods: {
      changePage(page) {
        if (!page) return;

        this.$emit('pageChanged', page);
        this.currentPage = page;
      },
      isCurrentPage(page) {
        return Number.parseInt(page, 10) === this.currentPage;
      },
      paginationClasses(page) {
        return {
          'text-blue-500 pointer-events-none': this.isCurrentPage(page),
          'text-gray-500 hover_text-gray-400': !this.isCurrentPage(page),
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  a {
    @apply relative inline-flex items-center border-t border-b;
    @apply border-gray-300 bg-white text-sm leading-5 font-medium;
    @apply transition ease-in-out duration-150;
  }

  .gap {
    @apply -ml-px relative inline-flex items-center px-4 py-1 border-t border-b;
    @apply border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700;
  }
</style>
