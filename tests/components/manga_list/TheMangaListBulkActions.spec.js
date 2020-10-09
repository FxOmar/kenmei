import TheMangaListBulkActions from '@/components/manga_list/TheMangaListBulkActions.vue';

describe('TheMangaListBulkActions.vue', () => {
  it('renders renders bulk actions button group', () => {
    const bulkActions = shallowMount(TheMangaListBulkActions);

    expect(bulkActions.html()).toMatchSnapshot();
  });

  describe('when pressing a button', () => {
    it('emits associated action', async () => {
      const bulkActions = shallowMount(TheMangaListBulkActions);

      await bulkActions.findAll('button').at(0).trigger('click');
      await bulkActions.findAll('button').at(1).trigger('click');
      await bulkActions.findAll('button').at(2).trigger('click');
      await bulkActions.findAll('button').at(3).trigger('click');

      expect(bulkActions.emitted('click').flat()).toEqual(
        ['bulkUpdate', 'bulkEdit', 'bulkDelete', 'bulkReport'],
      );
    });
  });
});
