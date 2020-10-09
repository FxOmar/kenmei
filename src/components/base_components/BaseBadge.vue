<template lang="pug">
  span(:class="classes")
    component.icon(v-if="icon" :is="icon")
    slot
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'primary',
      },
      icon: {
        type: String,
        default: '',
      },
    },
    computed: {
      classes() {
        return {
          'bg-blue-100 text-blue-800': this.type === 'primary',
          'bg-green-100 text-green-800': this.type === 'success',
          'bg-gray-100 text-gray-800': this.type === 'secondary',
          'bg-yellow-100 text-yellow-800': this.type === 'warning-light',
          'bg-orange-100 text-orange-800': this.type === 'warning',
          'bg-red-100 text-red-800': this.type === 'danger',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  span {
    @apply inline-flex items-center rounded-full text-xs font-medium leading-4;
    @apply px-2.5 py-0.5;
  }

  .icon {
    @apply -ml-1 mr-1 flex-shrink-0 self-center h-4 w-4;
  }
</style>
