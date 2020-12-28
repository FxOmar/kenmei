import Vuex from 'vuex';

import TheMangaListFooter from '@/components/manga_list/TheMangaListFooter.vue';
import PaginationInfo from '@/components/base_components/BasePaginationInfo.vue';
import PaginationPager from '@/components/base_components/BasePaginationPager.vue';

import lists from '@/store/modules/lists';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TheMangaListFooter.vue', () => {
  let store;
  let footer;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        lists: {
          namespaced: true,
          state: {
            tags: [],
            entries: [],
            selectedEntries: [],
            entriesPagy: { pages: 1 },
          },
          getters: lists.getters,
        },
      },
    });
  });

  describe('when entries are loading', () => {
    beforeEach(() => {
      footer = shallowMount(TheMangaListFooter, {
        store,
        localVue,
        computed: {
          entriesLoading: () => true,
        },
      });
    });

    it('shows skeleton loader', () => {
      expect(footer.get('.animate-pulse')).toBeTruthy();
    });
  });

  describe('when selection mode is active', () => {
    beforeEach(() => {
      footer = shallowMount(TheMangaListFooter, {
        store,
        localVue,
        computed: {
          selectionModeActive: () => true,
          entriesLoading: () => false,
          selectedEntries: () => [factories.entry.build()],
        },
      });
    });

    it('shows number of selected entries', () => {
      expect(footer.text()).toContain('Selected\n1\n entries');
    });
  });

  describe('when entriesPagy is present', () => {
    beforeEach(() => {
      footer = shallowMount(TheMangaListFooter, {
        store,
        localVue,
        computed: {
          selectionModeActive: () => false,
          entriesLoading: () => false,
        },
      });
    });

    it('shows BasePaginationInfo component', () => {
      expect(footer.findComponent(PaginationInfo).exists()).toBeTruthy();
    });
  });

  describe('when there are more than 1 pages', () => {
    beforeEach(() => {
      store.state.lists.entriesPagy = { pages: 2 };

      footer = shallowMount(TheMangaListFooter, {
        store,
        localVue,
        computed: {
          selectionModeActive: () => false,
          entriesLoading: () => false,
        },
      });
    });

    afterEach(() => {
      store.state.lists.entriesPagy = { pages: 1 };
    });

    it('shows BasePaginationPager component', () => {
      expect(footer.findComponent(PaginationPager).element)
        .toHaveClass('visible');
    });
  });
});
