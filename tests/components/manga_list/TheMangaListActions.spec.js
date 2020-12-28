import Vuex from 'vuex';

import TheMangaListActions from '@/components/manga_list/TheMangaListActions.vue';
import BulkActions from '@/components/manga_list/TheMangaListBulkActions';

import lists from '@/store/modules/lists';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TheMangaListActions.vue', () => {
  let store;
  let actions;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        lists: {
          namespaced: true,
          state: lists.state,
          mutations: lists.mutations,
          getters: lists.getters,
        },
      },
    });
  });

  describe('when on mobile', () => {
    describe('and select mode is active', () => {
      beforeEach(() => {
        actions = shallowMount(TheMangaListActions, {
          store,
          localVue,
          mocks: { $screen: { lg: false, touch: true } },
          computed: { selectionModeActive: () => true },
        });
      });

      it('shows edit fab', () => {
        expect(actions.findComponent({ ref: 'editFab' }).exists()).toBeTruthy();
        expect(actions.findComponent({ ref: 'addFab' }).exists()).toBeFalsy();
      });
    });

    describe('and select mode is inactive', () => {
      beforeEach(() => {
        actions = shallowMount(TheMangaListActions, {
          store,
          localVue,
          mocks: { $screen: { lg: false, touch: true } },
          computed: { selectionModeActive: () => false },
        });
      });

      it('shows add entry fab', () => {
        expect(actions.findComponent({ ref: 'addFab' }).exists()).toBeTruthy();
        expect(actions.findComponent({ ref: 'editFab' }).exists()).toBeFalsy();
      });
    });
  });

  describe('when on desktop', () => {
    describe('and select mode is active', () => {
      beforeEach(() => {
        actions = shallowMount(TheMangaListActions, {
          store,
          localVue,
          mocks: { $screen: { lg: true, touch: false } },
          computed: { selectionModeActive: () => true },
        });
      });

      it('shows bulk actions', () => {
        expect(actions.findComponent(BulkActions).exists()).toBeTruthy();
      });
    });

    describe('and select mode is inactive', () => {
      beforeEach(() => {
        actions = shallowMount(TheMangaListActions, {
          store,
          localVue,
          mocks: { $screen: { lg: true, touch: false } },
          computed: { selectionModeActive: () => false },
        });
      });

      it('shows bulk actions', () => {
        expect(actions.text()).toContain('Add Manga');
        expect(actions.text()).toContain('Import');
      });
    });
  });
});
