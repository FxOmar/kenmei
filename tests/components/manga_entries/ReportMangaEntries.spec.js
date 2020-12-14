import Vuex from 'vuex';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import ReportMangaEntries from '@/components/manga_entries/ReportMangaEntries.vue';
import lists from '@/store/modules/lists';
import * as mangaEntriesErrors from '@/services/endpoints/MangaEntriesErrors';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('ReportMangaEntries.vue', () => {
  let store;
  let reportMangaEntries;
  let postMangaEntriesErrorsMock;

  const entry1 = factories.entry.build({ id: 1 });

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        lists: {
          namespaced: true,
          state: { selectedEntries: [entry1] },
          mutations: lists.mutations,
          getters: lists.getters,
        },
      },
    });

    reportMangaEntries = shallowMount(ReportMangaEntries, {
      localVue,
      store,
      data() { return { currentIssue: 0 }; },
    });
  });

  it('shows correct helper text depending on issue type', async () => {
    expect(reportMangaEntries.text()).toContain('outdated or incorrect');

    await reportMangaEntries.setData({ currentIssue: 1 });

    expect(reportMangaEntries.text()).toContain('manga titles are duplicated');
  });

  describe('when only one entry selected for duplicated report', () => {
    beforeEach(() => {
      reportMangaEntries = shallowMount(ReportMangaEntries, {
        localVue,
        store,
        data() { return { currentIssue: 0 }; },
      });
    });

    it('disables submit button', async () => {
      const button = reportMangaEntries
        .findComponent({ ref: 'reportEntriesButton' });

      await reportMangaEntries.setData({ currentIssue: 1 });

      expect(button.element).toHaveAttribute('disabled');

      store.state.lists.selectedEntries = factories.entry.buildList(2);

      await flushPromises();

      expect(button.element).not.toHaveAttribute('disabled');
    });
  });

  describe('when reporting issues', () => {
    beforeEach(() => {
      postMangaEntriesErrorsMock = jest.spyOn(
        mangaEntriesErrors, 'postMangaEntriesErrors',
      );
    });

    afterEach(() => {
      expect(postMangaEntriesErrorsMock).toHaveBeenCalledWith([1], 0);
    });

    describe('and report was successful', () => {
      it('shows successful message', async () => {
        const infoMessageMock = jest.spyOn(Message, 'success');

        postMangaEntriesErrorsMock.mockResolvedValue(true);

        reportMangaEntries.vm.report();

        await flushPromises();

        expect(reportMangaEntries.emitted('closeDialog')).toBeTruthy();
        expect(infoMessageMock).toHaveBeenCalledWith(
          'Issue reported successfully',
        );
      });
    });

    describe('and report was unsuccessful', () => {
      it('shows failure message', async () => {
        const errorMessageMock = jest.spyOn(Message, 'error');

        postMangaEntriesErrorsMock.mockResolvedValue(false);

        reportMangaEntries.vm.report();

        await flushPromises();

        expect(errorMessageMock).toHaveBeenCalledWith(
          'Failed to report. Try reloading the page before trying again',
        );
      });
    });
  });
});
