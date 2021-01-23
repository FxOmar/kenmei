import BaseButton from '../components/base_components/BaseButton.vue';

export default {
  title: 'Base Components/Buttons',
};

export const Buttons = () => ({
  components: { BaseButton },
  template: `
    <div class="mx-5 my-5">
      <h2 class="my-2">Regular</h2>
      <div class="flex w-64 space-x-3">
        <base-button>Primary</base-button>
        <base-button colour="success">Success</base-button>
        <base-button colour="secondary">Secondary</base-button>
        <base-button colour="info">Info</base-button>
        <base-button colour="warning">Warning</base-button>
        <base-button colour="danger">Danger</base-button>
      </div>
      <h2 class="my-2">Disabled</h2>
      <div class="flex w-64 space-x-3">
        <base-button disabled>Primary</base-button>
        <base-button colour="success" disabled>Success</base-button>
        <base-button colour="secondary" disabled>Secondary</base-button>
        <base-button colour="info" disabled>Info</base-button>
        <base-button colour="warning" disabled>Warning</base-button>
        <base-button colour="danger" disabled>Danger</base-button>
      </div>
    </div>
  `,
});
