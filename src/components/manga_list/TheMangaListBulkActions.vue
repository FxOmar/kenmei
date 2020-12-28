<template lang="pug">
  span.relative.z-0.inline-flex.shadow-sm.rounded-md
    button.flex.justify-center.group(
      v-for='(button, index) in buttons'
      :key="index"
      :class="buttonClasses(index)"
      @click="$emit('click', button.action)"
    )
      component.-ml-1.mr-2.h-5.w-5.text-gray-400(
        :is='button.icon'
        :class="hoverClasses(button.action)"
      )
      span(v-text="button.text" :class="hoverClasses(button.action)")
</template>

<script>
  export default {
    data() {
      return {
        buttons: [
          {
            text: 'Read',
            action: 'bulkUpdate',
            icon: 'IconCheckCircle',
          },
          {
            text: 'Edit',
            action: 'bulkEdit',
            icon: 'IconEdit',
          },
          {
            text: 'Delete',
            action: 'bulkDelete',
            icon: 'IconTrash',
          },
          {
            text: 'Report',
            action: 'bulkReport',
            icon: 'IconWarning',
          },
        ],
      };
    },
    methods: {
      buttonClasses(index) {
        return {
          'rounded-l-md': index === 0,
          '-ml-px': index !== 0,
          'rounded-r-md': index === this.buttons.length - 1,
        };
      },
      hoverClasses(action) {
        return {
          'group-hover_text-red-400': action === 'bulkDelete',
          'group-hover_text-gray-800': action === 'bulkEdit',
          'group-hover_text-green-400': action === 'bulkUpdate',
          'group-hover_text-yellow-400': action === 'bulkReport',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  button {
    @apply w-full py-2 relative inline-flex items-center border border-gray-300;
    @apply bg-white text-sm leading-5 font-medium text-gray-700;
    @apply transition ease-in-out duration-150;

    &:hover {
      @apply text-gray-500;
    }

    &:focus {
      @apply z-10 outline-none border-gray-300 shadow-none;
    }

    &:active {
      @apply bg-gray-100 text-gray-700;
    }

    @screen sm {
      @apply px-4;
    }
  }

  .slide-transition {
    @apply transition ease-in duration-300 transition-all overflow-hidden;
  }
</style>
