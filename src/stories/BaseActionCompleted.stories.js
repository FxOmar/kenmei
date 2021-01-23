import BaseActionCompleted from '../components/base_components/BaseActionCompleted.vue';

export default {
  title: 'Base Components/Action Completed',
};

export const ActionCompleted = () => ({
  components: { BaseActionCompleted },
  template: `
    <div class="mx-5 my-5">
      <div class="flex w-full space-x-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm_p-6">
            <base-action-completed
              header='Import started'
              text='We will contact you soon'
              buttonText='Go back to dashboard'>
            </base-action-completed>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm_p-6">
            <base-action-completed
              type='danger'
              header='Import failed'
              text='We will contact you soon'
              buttonText='Go back to dashboard'>
            </base-action-completed>
          </div>
        </div>
      </div>
    </div>
  `,
});
