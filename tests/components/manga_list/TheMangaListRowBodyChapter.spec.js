import TheMangaListRowBodyChapter from '@/components/manga_list/TheMangaListRowBodyChapter.vue';
import BaseBadge from '@/components/base_components/BaseBadge.vue';

describe('TheMangaListRowBodyChapter.vue', () => {
  let rowBodyChapter;

  beforeEach(() => {
    rowBodyChapter = shallowMount(TheMangaListRowBodyChapter, {
      mocks: {
        $screen: jest.fn(),
      },
    });
  });

  describe('when chapter is present', () => {
    describe('with volume', () => {
      beforeEach(() => {
        rowBodyChapter.setProps({ volume: 1, chapter: 2 });
      });

      it('shows a badge with chapter and volume', () => {
        expect(rowBodyChapter.text()).toContain('Vol. 1 Ch. 2');
      });
    });

    describe('and it is a numeral', () => {
      beforeEach(() => {
        rowBodyChapter.setProps({ chapter: 2 });
      });

      it('shows a badge with chapter and volume', () => {
        expect(rowBodyChapter.text()).toContain('Ch. 2');
      });
    });

    describe('and it is a title', () => {
      beforeEach(() => {
        rowBodyChapter.setProps({ chapter: 'Title' });
      });

      it('shows a badge with chapter and volume', () => {
        expect(rowBodyChapter.text()).toContain('Title');
      });
    });
  });

  describe('when chapter is not present', () => {
    describe('and it is current type', () => {
      beforeEach(() => {
        rowBodyChapter.setProps({ type: 'current' });
      });

      it('shows a badge with chapter and volume', () => {
        expect(rowBodyChapter.text()).toContain('No chapters read');
      });
    });

    describe('and it is released type', () => {
      beforeEach(() => {
        rowBodyChapter.setProps({ type: 'released' });
      });

      it('shows a badge with chapter and volume', () => {
        expect(rowBodyChapter.text()).toContain('No chapters available');
      });
    });
  });

  describe("when it's mobile", () => {
    beforeEach(() => {
      rowBodyChapter = shallowMount(TheMangaListRowBodyChapter, {
        mocks: {
          $screen: jest.fn(() => { lg: true; }), //eslint-disable-line
        },
      });
    });

    describe('and it is current type', () => {
      beforeEach(() => {
        rowBodyChapter.setProps({ type: 'current' });
      });

      it('passed IconBookmark to the badge', () => {
        expect(rowBodyChapter.findComponent(BaseBadge).props('icon'))
          .toBe('IconBookmark');
      });
    });

    describe('and it is released type', () => {
      beforeEach(() => {
        rowBodyChapter.setProps({ type: 'released' });
      });

      it('passed IconBell to the badge', () => {
        expect(rowBodyChapter.findComponent(BaseBadge).props('icon'))
          .toBe('IconBell');
      });
    });
  });
});
