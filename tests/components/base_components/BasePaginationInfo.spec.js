import BasePaginationInfo from '@/components/base_components/BasePaginationInfo.vue';

describe('BasePaginationInfo.vue', () => {
  let paginationInfo;

  beforeEach(() => {
    paginationInfo = shallowMount(BasePaginationInfo, {
      propsData: { pagy: { from: 1, to: 3, count: 3 } },
    });
  });

  describe('when loading is true', () => {
    beforeEach(() => { paginationInfo.setProps({ loading: true }); });

    it('shows skeleton loader', () => {
      expect(paginationInfo.get('.animate-pulse').element).toBeVisible();
      expect(paginationInfo.get('p').element).not.toBeVisible();
    });
  });

  describe('when loading is false', () => {
    beforeEach(() => { paginationInfo.setProps({ loading: false }); });

    it('shows count based on pagy attributes', () => {
      expect(paginationInfo.get('.animate-pulse').element).not.toBeVisible();
      expect(paginationInfo.get('p').element).toBeVisible();
    });
  });
});
