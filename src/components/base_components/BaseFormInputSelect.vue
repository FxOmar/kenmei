<template lang="pug">
  .space-y-1
    label#listbox-label.block.text-sm.leading-5.font-medium.text-gray-700(
      v-if="label"
      v-text="label"
    )
    .relative(ref="baseFormSelect")
      span.inline-block.w-full.rounded-md
        button.dropdown-button(type='button' :name='dropdownID')
          span.block.truncate(
            ref="selectedValueContainer"
            v-if="selectedLabel"
            v-text="selectedLabel"
          )
          span.block.truncate.text-gray-400(
            ref="placeholderContainer"
            v-else-if="placeholder"
            v-text="placeholder"
          )
          span.chevron-wrapper
            icon-chevron-down.chevron.transform(
              :class="{ '-rotate-180': listBoxOpen }"
            )
      tippy-component(
        ref="dropdownTippy"
        trigger="click"
        arrow="false"
        role="dropdown"
        animation="shift-away"
        theme="tailwind-ui"
        appendTo="parent"
        placement="bottom"
        maxWidth="100%"
        :to='dropdownID'
        @show="listBoxOpen = true"
        @hide="listBoxOpen = false"
        interactive
      )
        ul(tabindex='-1')
          li(
            v-for="(item, index) in items"
            :key="index"
            @click="select(itemValue(item))"
          )
            span.block.truncate(
              v-text="itemLabel(item)"
              :class="itemClasses(itemValue(item))"
            )
            span.checkmark(v-if="value === itemValue(item)")
              icon-check-solid.h-5.w-5
</template>

<script>
  import uniqueId from 'lodash/uniqueId';
  import { TippyComponent } from 'vue-tippy';

  export default {
    components: {
      TippyComponent,
    },
    props: {
      value: {
        type: [String, Number, Object],
        default: null,
      },
      valueKey: {
        type: String,
        default: '',
      },
      textKey: {
        type: String,
        default: '',
      },
      label: {
        type: String,
        default: null,
      },
      helperText: {
        type: String,
        default: null,
      },
      // TODO: If valueKey or textKey present, validate array of objects to contain them
      items: {
        type: Array,
        required: true,
      },
      placeholder: {
        type: String,
        default: null,
      },
      validator: {
        type: Object,
        default: null,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        listBoxOpen: false,
      };
    },
    computed: {
      selectedLabel() {
        if (this.value === null) { return; }

        if (this.valueKey.length) {
          return this.items
            .find((item) => item[this.valueKey] === this.value)[this.textKey];
        }

        return this.items.find((item) => item === this.value);
      },
      dropdownTippy() {
        return this.$refs.dropdownTippy.$el.classList.value;
      },
      dropdownID() {
        return uniqueId('dropdown-');
      },
    },
    methods: {
      itemValue(item) {
        return this.valueKey.length ? item[this.valueKey] : item;
      },
      itemLabel(item) {
        return item[this.textKey];
      },
      select(item) {
        this.$emit('input', item);
        this.$refs.dropdownTippy.tippy().hide();
      },
      selected(item) {
        return this.selectedValue === item;
      },
      itemClasses(item) {
        return {
          'font-semibold': this.selectedValue === item,
          'font-normal': !this.selectedValue === item,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep .tippy-popper {
    min-width: -webkit-max-content;
    min-width: -moz-max-content;
    min-width: max-content;

    @apply w-full max-w-full;
  }

  ::v-deep .tailwind-ui-theme {
    @apply rounded-md bg-white shadow-lg p-0 text-left;
  }

  ul {
    @apply max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto;

    &:focus {
      @apply outline-none;
    }

    @screen sm {
      @apply text-sm leading-5;
    }
  }

  li {
    @apply text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9;
    @apply text-sm;

    &:hover {
      @apply bg-gray-100 text-gray-900;
    }
  }

  .dropdown-button {
    @apply cursor-pointer relative w-full rounded-md border border-gray-300;
    @apply text-gray-700 bg-white px-4 py-2 text-left leading-5;
    @apply font-medium transition ease-in-out duration-150;

    &:focus {
      @apply outline-none shadow-outline-blue border-blue-300;
    }

    @screen sm {
      @apply text-sm leading-5;
    }
  }

  .checkmark {
    @apply text-blue-600 absolute inset-y-0 right-0 flex items-center pr-4;
  }

  .chevron {
    @apply h-5 w-5 text-gray-400 transition-transform duration-200 ease-in-out;
  }

  .chevron-wrapper {
    @apply absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none;
  }
</style>
