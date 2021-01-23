import BaseBanner from '../components/base_components/BaseBanner.vue';

export default {
  title: 'Base Components/Banner',
  decorators: [() => ({
    template: `
      <div class="min-h-screen bg-gray-100">
        <story />
        <div class="py-10">
          <main>
            <div class="max-w-7xl mx-auto sm_px-6 lg_px-8">
              <div class="px-4 py-8 sm_px-0">
                <div class="border-4 border-dashed border-gray-200 rounded-lg h-96"/>
              </div>
            </div>
          </main>
        </div>
      </div>
    `,
  })],
};

export const Banner = () => ({
  components: { BaseBanner },
  template: '<base-banner text="Some new exciting announcement" />',
});

export const BannerWithLink = () => ({
  components: { BaseBanner },
  template: `
    <base-banner text="Some new exciting announcement" link="example.com" />
  `,
});
