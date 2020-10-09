import Vuex from 'vuex';

import TheMangaListHeader from '@/components/manga_list/TheMangaListHeader.vue';
import PaginationInfo from '@/components/base_components/BasePaginationInfo.vue';
import FormCheckbox from '@/components/base_components/BaseFormCheckbox.vue';

import lists from '@/store/modules/lists';

const localVue = createLocalVue();

localVue.use(Vuex);

const toggleSelectedEntry = (store, entries) => {
  store.state.lists.selectedEntries = entries;
  store.state.lists.checkboxToggled = true;
};
const resetSelectedEntries = (store) => {
  store.state.lists.selectedEntries = [];
  store.state.lists.checkboxToggled = false;
};

describe('TheMangaListHeader.vue', () => {
  let store;
  let header;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        lists: {
          namespaced: true,
          state: {
            tags: [],
            entries: [],
            selectedEntries: [],
            entriesPagy: { pages: 1, count: 2, items: 2 },
          },
          getters: lists.getters,
          mutations: lists.mutations,
        },
      },
    });
  });

  describe('when entries are loading', () => {
    beforeEach(() => {
      header = shallowMount(TheMangaListHeader, {
        store,
        localVue,
        computed: { entriesLoading: () => true },
      });
    });

    it('shows skeleton loader and disabled checkbox', () => {
      expect(header.get('.animate-pulse').exists()).toBeTruthy();
      expect(header.findComponent(FormCheckbox).attributes('disabled'))
        .toBeTruthy();
    });
  });

  describe('when entries are not loading', () => {
    describe('and checkbox is toggled', () => {
      let entries;

      beforeEach(() => {
        entries = factories.entry.buildList(2);
        header = shallowMount(TheMangaListHeader, {
          store,
          localVue,
          computed: {
            entriesLoading: () => false,
            entries: () => entries,
          },
        });
      });

      it('adds all entries to selectedEntries', () => {
        expect(store.state.lists.checkboxToggled).toBeFalsy();
        expect(store.state.lists.selectedEntries).toEqual([]);

        header.findComponent(FormCheckbox).vm.$emit('input', true);

        expect(store.state.lists.selectedEntries).toHaveLength(2);
        expect(store.state.lists.checkboxToggled).toBeTruthy();
      });

      describe('and checkbox was already toggled', () => {
        beforeEach(() => { toggleSelectedEntry(store, entries); });
        afterEach(() => { resetSelectedEntries(store); });

        it('removes selected entries', () => {
          expect(store.state.lists.checkboxToggled).toBeTruthy();
          expect(store.state.lists.selectedEntries).toEqual(entries);

          header.findComponent(FormCheckbox).vm.$emit('input', false);

          expect(store.state.lists.selectedEntries).toEqual([]);
          expect(store.state.lists.checkboxToggled).toBeFalsy();
        });
      });

      describe('and checkbox is indeterminate', () => {
        beforeEach(() => { toggleSelectedEntry(store, [entries[0]]); });
        afterEach(() => { resetSelectedEntries(store); });

        it('selects all remaining entries', () => {
          expect(store.state.lists.checkboxToggled).toBeTruthy();
          expect(store.state.lists.selectedEntries).toEqual([entries[0]]);

          header.findComponent(FormCheckbox).vm.$emit('input', false);

          expect(store.state.lists.selectedEntries).toEqual(entries);
          expect(store.state.lists.checkboxToggled).toBeTruthy();
        });
      });
    });
    describe('and selection mode is active', () => {
      beforeEach(() => {
        header = shallowMount(TheMangaListHeader, {
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
        expect(header.text()).toContain('Selected\n1\n entries');
      });
    });

    describe('and selection mode is inactive', () => {
      describe('and entriesPagy has count', () => {
        beforeEach(() => {
          store.state.lists.entriesPagy = { count: 2 };

          header = shallowMount(TheMangaListHeader, {
            store,
            localVue,
            computed: {
              selectionModeActive: () => false,
              entriesLoading: () => false,
            },
          });
        });

        afterEach(() => {
          store.state.lists.entriesPagy = { count: 0 };
        });

        it('shows BasePaginationInfo component', () => {
          expect(header.findComponent(PaginationInfo).exists()).toBeTruthy();
        });
      });
    });
  });
});
