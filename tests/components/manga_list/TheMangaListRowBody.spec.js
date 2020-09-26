import TheMangaListRowBody from '@/components/manga_list/TheMangaListRowBody.vue';
import Chapter from '@/components/manga_list/TheMangaListRowBodyChapter.vue';

import Vuex from 'vuex';

import lists from '@/store/modules/lists';

const localVue = createLocalVue();

localVue.directive('tippy', true);
localVue.use(Vuex);

describe('TheMangaListRowBody.vue', () => {
  let store;
  let rowBody;
  let entry;

  const screen = { lg: true, touch: false };

  beforeEach(() => {
    entry = factories.entry.build();
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

    rowBody = shallowMount(TheMangaListRowBody, {
      store,
      localVue,
      mocks: { $screen: screen },
      propsData: { item: entry },
    });
  });

  it('shows title, status and chapters for released and last available', () => {
    expect(rowBody.html()).toMatchSnapshot();
  });

  describe('when last read is unknown', () => {
    describe('and last_chapter_read is present', () => {
      beforeEach(() => {
        entry = factories.entry.build({ attributes: { last_read_at: null } });

        rowBody.setProps({ item: entry });
      });

      it('shows Last read is unknown', () => {
        expect(rowBody.text()).toContain('Last read is unknown');
      });
    });

    describe('and last_chapter_read is not present', () => {
      beforeEach(() => {
        entry = factories.entry.build({
          attributes: { last_chapter_read: null, last_read_at: null },
        });

        rowBody.setProps({ item: entry });
      });

      it("shows haven't read yet", () => {
        expect(rowBody.text()).toContain("Haven't read yet");
      });
    });
  });

  describe('when last released is unknown', () => {
    beforeEach(() => {
      entry = factories.entry.build({ attributes: { last_released_at: null } });

      rowBody.setProps({ item: entry });
    });

    it('shows Last Released is unknown', () => {
      expect(rowBody.text()).toContain('Last Released is unknown');
    });
  });

  describe('when on mobile', () => {
    beforeEach(() => {
      rowBody = shallowMount(TheMangaListRowBody, {
        store,
        localVue,
        mocks: { $screen: { lg: false, touch: true } },
        propsData: { item: entry },
      });
    });

    it('hides timestamps', () => {
      expect(rowBody.text()).not.toContain('ago');
    });
  });
});
