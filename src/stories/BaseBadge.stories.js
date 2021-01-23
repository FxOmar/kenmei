import BaseBadge from '../components/base_components/BaseBadge.vue';

export default {
  title: 'Base Components/Badges',
};

export const Badges = () => ({
  components: { BaseBadge },
  template: `
    <div class="mx-5 my-5">
      <h2 class="my-4">Regular</h2>
      <div class="flex space-x-3">
        <base-badge>Primary</base-badge>
        <base-badge type="success">Success</base-badge>
        <base-badge type="secondary">Secondary</base-badge>
        <base-badge type="warning">Warning</base-badge>
        <base-badge type="warning-light">Warning Light</base-badge>
        <base-badge type="danger">Danger</base-badge>
      </div>
      <h2 class="my-4">With Icon</h2>
      <div class="flex space-x-3">
        <base-badge icon="IconBookmark">Success</base-badge>
        <base-badge icon="IconBell">Secondary</base-badge>
      </div>
    </div>
  `,
});
