<template lang="pug">
  .relative
    base-form-autocomplete(
      label="Series title"
      placeholder="One Piece"
      helperText="You can search by English or Romaji titles"
      valueKey="id"
      textKey="title"
      :selectedValue="selectedSeriesID"
      :items="items"
      :loading="loading"
      :validator="$v.searchQuery"
      @selected="selectSeries($event)"
      @input="searchQuery = $event"
    )
      template(slot='icon')
        icon-search.h-5.w-5
    base-form-input-select.mt-5(
      v-model="$v.mangaSourceID.$model"
      label="Source Name"
      placeholder="Select series first"
      valueKey="id"
      textKey="name"
      :class="responsiveClasses"
      :disabled="!availableSources.length"
      :items="availableSources"
    )
</template>

<script>
  import debounce from 'lodash/debounce';
  import { required, url, not } from 'vuelidate/lib/validators';
  import { Message, Select, Option } from 'element-ui';
  import { mapState } from 'vuex';

  import { index } from '@/services/endpoints/v1/manga_series';

  export default {
    components: {
      'el-select': Select,
      'el-option': Option,
    },
    props: {
      addingEntry: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        items: [],
        searchQuery: '',
        selectedSeriesID: '',
        mangaSourceID: '',
        loading: false,
      };
    },
    validations: {
      searchQuery: {
        required,
        isNotURL: not(url),
      },
      selectedSeriesID: {
        required,
      },
      mangaSourceID: {
        required,
      },
    },
    computed: {
      ...mapState('lists', [
        'statuses',
      ]),
      responsiveClasses() {
        return {
          hidden: !this.availableSources.length,
        };
      },
      hasErrors() {
        const { mangaSourceID } = this.$v;

        return !mangaSourceID.required
          && mangaSourceID.$dirty
          && this.availableSources.length;
      },
      selectedSeries() {
        return this.items.find((item) => item.id === this.selectedSeriesID);
      },
      availableSources() {
        if (!this.selectedSeries) { return []; }

        return this.selectedSeries.mangaSources;
      },
    },
    watch: {
      async searchQuery(title) {
        this.$v.$touch();
        if (this.$v.searchQuery.$error) {
          this.resetItems();
          return;
        }

        this.loading = true;

        const response = await index(title);
        const { status, data } = response;

        if (status === 200) {
          this.items = data.data;
        } else {
          Message.error(
            "Couldn't fetch series. Try refreshing the page before trying again",
          );
        }

        this.loading = false;
      },
      availableSources(sources) {
        if (!sources.length) return;

        this.mangaSourceID = sources[0].id;
      },
      mangaSourceID(newID, oldID) {
        if (newID !== oldID) { this.$emit('mangaSourceSelected', newID); }
      },
      addingEntry(val) { if (val) { this.$v.$touch(); } },
      $v: {
        handler(val) { this.$emit('validationUpdated', val); },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      selectSeries(title) {
        this.selectedSeriesID = title;
        this.mangaSourceID = null;
      },
      resetItems: debounce(function (_e) { // eslint-disable-line func-names
        this.items = [];
      }, 200),
    },
  };
</script>

<style lang="scss" scoped>
  .slide-enter-active,
  .slide-leave-active {
    @apply transition ease-in duration-200 transition-all overflow-hidden;
  }

  .slide-enter,
  .slide-leave-to {
    @apply opacity-0 transform -translate-y-1;
  }
</style>
