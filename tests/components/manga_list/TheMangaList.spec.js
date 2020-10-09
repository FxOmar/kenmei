import Vuex from 'vuex';

import MangaList from '@/components/manga_list/TheMangaList.vue';
import Actions from '@/components/manga_list/TheMangaListActions.vue';
import Row from '@/components/manga_list/TheMangaListRow.vue';
import RowSkeleton from '@/components/manga_list/TheMangaListRowSkeleton.vue';
import Footer from '@/components/manga_list/TheMangaListFooter.vue';

import lists from '@/store/modules/lists';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('TheMangaList.vue', () => {
  let store;
  let mangaList;

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

    mangaList = shallowMount(MangaList, { store, localVue });
  });

  describe('when entries are present', () => {
    beforeEach(() => {
      mangaList = shallowMount(MangaList, {
        store,
        localVue,
        computed: {
          entriesLoading: () => false,
          entries: () => factories.entry.buildList(2),
        },
      });
    });

    it('render rows for each entry and a footer', () => {
      expect(mangaList.findAllComponents(Row)).toHaveLength(2);
      expect(mangaList.findComponent(Footer).exists()).toBeTruthy();
    });

    describe('and row emits editEntry', () => {
      it('emits it to the parent', () => {
        mangaList.findAllComponents(Row).at(0).vm.$emit('editEntry', {});

        expect(mangaList.emitted('editEntry')[0]).toEqual([{}]);
      });
    });

    describe('and row emits deleteEntry', () => {
      it('emits it to the parent', () => {
        mangaList.findAllComponents(Row).at(0).vm.$emit('deleteEntry');

        expect(mangaList.emitted('deleteEntry')).toBeTruthy();
      });
    });

    describe('and footer emits pageChanged', () => {
      it('emits it to the parent', () => {
        mangaList.findComponent(Footer).vm.$emit('pageChanged', 2);

        expect(mangaList.emitted('pageChanged')[0]).toEqual([2]);
      });
    });
  });

  describe('when actions emits click', () => {
    it('when actions emits click, it emits it further to the parent', () => {
      mangaList.findComponent(Actions).vm.$emit('click', 'addManga');

      expect(mangaList.emitted('addManga')).toBeTruthy();
    });
  });

  describe('when entries are not present', () => {
    describe('and entriesLoading is true', () => {
      beforeEach(() => {
        mangaList = shallowMount(MangaList, {
          store,
          localVue,
          computed: { entriesLoading: () => true },
        });
      });

      it('show two skeleton rows', () => {
        expect(mangaList.findAllComponents(RowSkeleton).length).toBe(2);
      });
    });

    describe('and entriesLoading is false', () => {
      beforeEach(() => {
        mangaList = shallowMount(MangaList, {
          store,
          localVue,
          computed: { entriesLoading: () => false },
        });
      });

      it('with filters applied, shows Change Filters mesage', async () => {
        await mangaList.setProps({ filtersApplied: true });

        expect(mangaList.text()).not.toContain("You haven't imported any series");
        expect(mangaList.text()).toContain('No entries found');
      });

      it('with no filters applied, shows no entries message', async () => {
        await mangaList.setProps({ filtersApplied: false });

        expect(mangaList.text()).not.toContain('No entries found');
        expect(mangaList.text()).toContain("You haven't imported any series");
      });
    });
  });
});
