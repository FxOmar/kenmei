import BaseFormCheckbox from '../components/base_components/BaseFormCheckbox.vue';

export default {
  title: 'Base Components/Checkbox',
};

export const Checkbox = () => ({
  components: { BaseFormCheckbox },
  template: `
    <div class="mx-5 my-5">
      <h2 class="my-4">Regular</h2>
      <div class='space-y-3'>
        <base-form-checkbox value='true'>Checked</base-form-checkbox>
        <base-form-checkbox indeterminate='true'>Indeterminate</base-form-checkbox>
        <base-form-checkbox>Unchecked</base-form-checkbox>
      </div>

      <h2 class="my-4">Disabled</h2>
      <div class='space-y-3'>
        <base-form-checkbox value='true' disabled>Checked</base-form-checkbox>
        <base-form-checkbox indeterminate='true' disabled>Indeterminate</base-form-checkbox>
        <base-form-checkbox disabled>Unchecked</base-form-checkbox>
      </div>
    </div>
  `,
});
