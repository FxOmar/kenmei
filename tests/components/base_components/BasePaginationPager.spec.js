import BasePaginationPager from '@/components/base_components/BasePaginationPager.vue';

describe('BasePaginationPager.vue', () => {
  let paginationPager;

  beforeEach(() => {
    paginationPager = shallowMount(BasePaginationPager, {
      propsData: {
        pagy: {
          from: 1, to: 2, count: 2, series: ['1', 2], prev: null, next: 2,
        },
      },
    });
  });

  it('shows gap page', () => {
    expect(paginationPager.html()).toMatchSnapshot();
  });

  describe('when gap is present', () => {
    beforeEach(() => {
      paginationPager.setProps({
        pagy: {
          from: 1, to: 2, count: 2, series: ['1', 'gap', 2], prev: null, next: 2,
        },
      });
    });

    it('shows gap page', () => {
      expect(paginationPager.text()).toContain('…');
    });
  });

  describe('when previous button is not in pagy', () => {
    it('disables it', () => {
      expect(paginationPager.findAll('a').at(0).element)
        .toHaveClass('cursor-not-allowed');
    });
  });

  describe('when next button is not in pagy', () => {
    beforeEach(() => {
      paginationPager.setProps({
        pagy: {
          from: 1, to: 2, count: 2, series: [1, '2'], prev: 1, next: null,
        },
      });
    });

    it('disables it', () => {
      expect(paginationPager.findAll('a').at(3).element)
        .toHaveClass('cursor-not-allowed');
    });
  });

  describe('when component is mounted', () => {
    it('sets currentPage to currentPagyPage', () => {
      expect(paginationPager.vm.$data.currentPage).toEqual(1);
    });
  });

  describe('when component is updated', () => {
    describe('and pagy has a new current page', () => {
      beforeEach(() => {
        paginationPager.setProps({
          pagy: {
            from: 1, to: 2, count: 2, series: [1, '2'], prev: 1, next: null,
          },
          loading: false,
        });
      });

      it('sets currentPage to currentPagyPage', () => {
        expect(paginationPager.vm.$data.currentPage).toEqual(2);
      });
    });

    describe('and loading is true', () => {
      beforeEach(() => {
        paginationPager.setProps({
          pagy: {
            from: 1, to: 2, count: 2, series: [1, '2'], prev: 1, next: null,
          },
          loading: true,
        });
      });

      it("doesn't update currentPage", () => {
        expect(paginationPager.vm.$data.currentPage).toEqual(1);
      });
    });

    describe('and currentPage equals currentPagyPage', () => {
      beforeEach(() => {
        paginationPager.setData({ currentPage: 2 });
        paginationPager.setProps({
          pagy: {
            from: 1, to: 2, count: 2, series: [1, '2'], prev: 1, next: null,
          },
          loading: false,
        });
      });

      it("doesn't update currentPage", () => {
        expect(paginationPager.vm.$data.currentPage).toEqual(2);
      });
    });
  });

  describe('when changing pages', () => {
    it('emits pageChanged and sets currentPage', async () => {
      await paginationPager.findAll('a').at(3).trigger('click');

      expect(paginationPager.emitted('pageChanged')[0]).toEqual([2]);
    });

    describe('and no page provided', () => {
      it('does nothing', () => {
        paginationPager.vm.changePage(null);

        expect(paginationPager.emitted('pageChanged')).toBeFalsy();
      });
    });
  });
});
