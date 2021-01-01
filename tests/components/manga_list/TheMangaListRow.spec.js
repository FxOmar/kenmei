import i18n from 'i18n';

import TheMangaListRow from '@/components/manga_list/TheMangaListRow.vue';
import TheMangaListRowBody from '@/components/manga_list/TheMangaListRowBody.vue';
import RowSkeleton from '@/components/manga_list/TheMangaListRowSkeleton.vue';
import FormCheckbox from '@/components/base_components/BaseFormCheckbox.vue';
import IconButtonGroup from '@/components/base_components/BaseIconButtonGroup.vue';
import Dropdown from '@/components/base_components/BaseDropdown.vue';

import { Message } from 'element-ui';
import Vuex from 'vuex';

import flushPromises from 'flush-promises';
import * as api from '@/services/api';

import lists from '@/store/modules/lists';

const localVue = createLocalVue();

localVue.directive('touch', true);
localVue.directive('touch-options', true);

localVue.use(Vuex);

const toggleSelectedEntry = (store, entry) => {
  store.state.lists.selectedEntries = [entry];
  store.state.lists.checkboxToggled = true;
};

describe('TheMangaListRow.vue', () => {
  let store;
  let mangaListRow;
  let entry;

  const screen = { lg: true, touch: false };

  beforeEach(() => {
    entry = factories.entry.build({
      attributes: {
        title: 'Manga Title',
        last_volume_available: 2,
        last_chapter_available: 2,
      },
    });

    store = new Vuex.Store({
      modules: {
        lists: {
          namespaced: true,
          state: { ...lists.state },
          mutations: lists.mutations,
          getters: lists.getters,
        },
      },
    });

    mangaListRow = shallowMount(TheMangaListRow, {
      store,
      localVue,
      i18n,
      mocks: { $screen: screen },
      propsData: { item: entry },
    });
  });

  describe('when all entries are loading', () => {
    it('show skeleton loader with disabled checkbox', () => {
      expect(mangaListRow.findComponent(RowSkeleton).exists()).toBeTruthy();
      expect(mangaListRow.findComponent(FormCheckbox).attributes('disabled'))
        .toBeTruthy();
    });
  });

  describe('when specific entry is loading', () => {
    beforeEach(() => {
      store.state.lists.entriesLoading = false;
      store.state.lists.entriesUpdating = true;
      toggleSelectedEntry(store, entry);
    });

    it('show skeleton loader with disabled checkbox', () => {
      expect(mangaListRow.find('row-skeleton-stub').exists()).toBeTruthy();
      expect(mangaListRow.findComponent(FormCheckbox).attributes('disabled'))
        .toBeTruthy();
    });
  });

  describe('when no entries are loading', () => {
    beforeEach(() => {
      mangaListRow = shallowMount(TheMangaListRow, {
        store,
        localVue,
        i18n,
        mocks: { $screen: screen },
        computed: { entriesLoading: () => false },
        propsData: { item: entry },
      });
    });

    it('shows row body', () => {
      expect(mangaListRow.findComponent(TheMangaListRowBody).exists())
        .toBeTruthy();
    });

    describe('and item is unread', () => {
      it('shows unread indicator', () => {
        expect(mangaListRow.get('.unread-indicator').exists()).toBeTruthy();
      });
    });

    describe('and item is selected with checkboxToggled true', () => {
      beforeEach(() => { toggleSelectedEntry(store, entry); });

      it('toggles checkbox', () => {
        expect(mangaListRow.findComponent(FormCheckbox).attributes('value'))
          .toBeTruthy();
      });
    });

    describe('and checkbox is toggled', () => {
      it('adds item to selectedEntries', () => {
        expect(store.state.lists.checkboxToggled).toBeFalsy();

        mangaListRow.findComponent(FormCheckbox).vm.$emit('input', true);

        expect(store.state.lists.selectedEntries).toContain(entry);
        expect(store.state.lists.checkboxToggled).toBeTruthy();
      });

      describe('for item already selected', () => {
        beforeEach(() => { toggleSelectedEntry(store, entry); });

        it('does nothing', () => {
          expect(store.state.lists.checkboxToggled).toBeTruthy();
          expect(store.state.lists.selectedEntries).toEqual([entry]);

          mangaListRow.findComponent(FormCheckbox).vm.$emit('input', true);

          expect(store.state.lists.selectedEntries).toEqual([entry]);
          expect(store.state.lists.checkboxToggled).toBeTruthy();
        });
      });
    });

    describe('and checkbox is untoggled', () => {
      beforeEach(() => { toggleSelectedEntry(store, entry); });

      it('removes item from selectedEntries', () => {
        mangaListRow.findComponent(FormCheckbox).vm.$emit('input', false);

        expect(store.state.lists.selectedEntries).toEqual([]);
        expect(store.state.lists.checkboxToggled).toBeFalsy();
      });
    });

    describe('and edit button is pressed', () => {
      it('emits to the parent component', () => {
        mangaListRow.findComponent(IconButtonGroup).vm.$emit('click', 'Edit');

        expect(mangaListRow.emitted('editEntry')).toBeTruthy();
      });
    });

    describe('and set chapter to last read button is pressed', () => {
      let updateMangaEntryMock;

      beforeEach(async () => {
        updateMangaEntryMock = jest.spyOn(api, 'updateMangaEntry');
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('toggles selectedEntries with entriesUpdating', async () => {
        updateMangaEntryMock.mockResolvedValue(false);

        mangaListRow.findComponent(IconButtonGroup).vm
          .$emit('click', 'Set chapter to last read');

        expect(store.state.lists.selectedEntries).toContain(entry);
        expect(store.state.lists.checkboxToggled).toBeFalsy();
        expect(store.state.lists.entriesUpdating).toBeTruthy();

        await flushPromises();

        expect(store.state.lists.selectedEntries).toEqual([]);
        expect(store.state.lists.entriesUpdating).toBeFalsy();
      });

      it('mutates the state and shows success message', async () => {
        const infoMessageMock = jest.spyOn(Message, 'info');

        updateMangaEntryMock.mockResolvedValue(entry);

        mangaListRow.findComponent(IconButtonGroup).vm
          .$emit('click', 'Set chapter to last read');

        await flushPromises();

        // TODO: Expect call to the store
        expect(infoMessageMock).toHaveBeenCalledWith(
          'Updated last read to Vol. 2 Ch. 2',
        );
      });

      it('shows error message if update failed', async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        updateMangaEntryMock.mockResolvedValue(false);

        mangaListRow.findComponent(IconButtonGroup).vm
          .$emit('click', 'Set chapter to last read');

        await flushPromises();

        expect(errorMessageMock).toHaveBeenCalledWith(
          "Couldn't update. Try refreshing the page",
        );
      });
    });

    describe('and delete button is pressed', () => {
      it('adds to selectedEntries in store and emits to the parent', () => {
        mangaListRow.findComponent(IconButtonGroup).vm.$emit('click', 'Delete');

        expect(store.state.lists.selectedEntries).toContain(entry);
        expect(store.state.lists.checkboxToggled).toBeFalsy();
        expect(mangaListRow.emitted('deleteEntry')).toBeTruthy();
      });
    });

    describe('and it is not mobile', () => {
      it('shows IconButtonGroup instead of BaseDropdown', () => {
        expect(mangaListRow.findComponent(Dropdown).exists()).toBeFalsy();
        expect(mangaListRow.findComponent(IconButtonGroup).exists())
          .toBeTruthy();
      });
    });

    describe('and it is mobile', () => {
      beforeEach(() => {
        mangaListRow = shallowMount(TheMangaListRow, {
          store,
          localVue,
          i18n,
          mocks: { $screen: { lg: false, touch: true } },
          computed: { entriesLoading: () => false },
          propsData: { item: entry },
        });
      });

      it('shows BaseDropdown instead of IconButtonGroup', () => {
        expect(mangaListRow.findComponent(Dropdown).exists()).toBeTruthy();
        expect(mangaListRow.findComponent(IconButtonGroup).exists())
          .toBeFalsy();
      });

      describe('and selection mode is active', () => {
        beforeEach(() => {
          mangaListRow = shallowMount(TheMangaListRow, {
            store,
            localVue,
            i18n,
            mocks: { $screen: { lg: false, touch: true } },
            propsData: { item: entry },
            computed: {
              selectionModeActive: () => true,
              entriesLoading: () => false,
            },
          });
        });

        it('makes BaseDropdown invisible', () => {
          expect(mangaListRow.findComponent(Dropdown).isVisible())
            .toBeTruthy();
        });
      });
    });
  });
});
