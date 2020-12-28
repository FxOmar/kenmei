<template lang="pug">
  .inline-block.text-left
    span.relative.z-50
      button.fab.ripple(
        @click='open = !open'
        type='button'
        aria-haspopup='true'
        aria-expanded='false'
      )
        .absolute.transform.transition.duration-150(
          :class="open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'"
        )
          slot
        icon-cross.absolute.w-6.h-6.inline-block.text-white.transform.transition.duration-150(
          style="padding: 2px 0 0 2px"
          :class="open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'"
        )
    transition(name="overlay-fade")
      button.click-off-button(
        ref="clickOffButton"
        v-show='open'
        @click='open = false'
        tabindex='-1'
      )
        .absolute.inset-0.bg-white.opacity-95
    template(v-if="options.length")
      transition(name="dropdown")
        .dropdown-body.w-full.sm_w-40(v-show='open')
          .py-1
            a.group.justify-end.space-x-4(
              v-for="(option, index) in options"
              :key="index"
              href='#'
              @click.prevent="handleClick(option.action)"
            )
              span.text-gray-500(v-if="option.text" v-text="option.text")
              .secondary-fab.ripple
                component.h-5.w-5.text-gray-400(:is="option.icon")
</template>

<!-- TODO: Current fab can only close and open. When no options provided -->
<!-- we want to instead have a custom action to be used -->
<script>
  import {
    disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks,
  } from 'body-scroll-lock';

  export default {
    props: {
      options: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        open: false,
      };
    },
    watch: {
      open(val) {
        if (val) {
          // reserveScrollBarGap applies padding when disabling scrollbar
          disableBodyScroll(this.$refs.modal, { reserveScrollBarGap: true });
        } else {
          // Need to wait for animation to finish, to avoid content jump due to
          // padding change
          setTimeout(() => { enableBodyScroll(this.$refs.modal); }, 200);
        }
      },
    },
    destroyed() {
      // I need to enable body scroll, in case modal gets destroyed before the
      // prop change
      clearAllBodyScrollLocks();
    },
    methods: {
      handleClick(action) {
        this.$emit('click', action);
        this.open = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  a {
    -webkit-tap-highlight-color: transparent;
    @apply flex items-center pl-4 py-2 text-lg leading-5 text-gray-700;
    padding-right: 0.66rem;

    &:focus {
      @apply outline-none;
    }
  }

  .fab {
    -webkit-tap-highlight-color: transparent;
    @apply inline-flex justify-center items-center w-full rounded-full;
    @apply px-7 py-7 bg-blue-600 text-sm leading-5 font-medium text-gray-700;
    @apply transition ease-in-out duration-150;

    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
                0px 6px 10px 0px rgba(0, 0, 0, 0.14),
                0px 1px 18px 0px rgba(0,0,0,.12);

    &:focus {
      @apply outline-none;
    }
  }

  .secondary-fab {
    @apply bg-white rounded-full p-2;

    box-shadow: 0 1px 5px rgba(0,0,0,0.2),
                0 2px 2px rgba(0,0,0,0.14),
                0 3px 1px -2px rgba(0,0,0,0.12);
  }

  .click-off-button {
    @apply fixed h-full w-full inset-0 transition-opacity cursor-default;

    &:focus {
      @apply outline-none;
    }
  }

  .dropdown-body {
    min-width: -webkit-max-content;
    min-width: -moz-max-content;
    min-width: max-content;
    @apply origin-bottom absolute right-0 mt-2;
    @apply z-20;

    bottom: 65px;
  }

  .dropdown-enter-active {
    @apply ease-out duration-100;
  }

  .dropdown-leave-active {
    @apply ease-in duration-75;
  }

  .dropdown-enter,
  .dropdown-leave-to {
    @apply transform opacity-0 scale-95;
  }

  .dropdown-enter-to,
  .dropdown-leave {
    @apply transform opacity-100 scale-100;
  }

  .overlay-fade-enter-active,
  .overlay-fade-leave-active {
    @apply ease-out duration-200;
  }

  .overlay-fade-enter,
  .overlay-fade-leave-to {
    @apply opacity-0;
  }

  .overlay-fade-enter-to,
  .overlay-fade-leave {
    @apply opacity-100;
  }

  // Ripple click event
  .ripple {
    @apply relative overflow-hidden;

    transform: translate3d(0, 0, 0);
  }

  .ripple:after {
    @apply block absolute w-full h-full left-0 top-0 pointer-events-none;
    @apply opacity-0 bg-no-repeat;

    content: "";
    background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
    background-position: 50%;
    transform: scale(10, 10);
    transition: transform .3s, opacity 1s;
  }

  .ripple:active:after {
    transform: scale(0, 0);
    opacity: .3;
    transition: 0s;
  }
</style>
