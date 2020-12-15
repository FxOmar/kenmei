import Vuex from 'vuex';

import MangaListActions from '@/components/MangaListActions.vue';

import lists from '@/store/modules/lists';

const localVue = createLocalVue();

localVue.use(Vuex);

// TODO: Properly test this component
describe('MangaListActions.vue', () => {
  let store;
  let dashboardActions;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { lists: { namespaced: true, state: lists.state } },
    });

    dashboardActions = shallowMount(MangaListActions, {
      store,
      localVue,
      propsData: {
        selectedStatus: 1,
        selectedTagIDs: [],
        debouncedSearchTerm: '',
      },
      stubs: ['router-link'],
    });
  });

  it('renders component', async () => {
    expect(dashboardActions.html()).toMatchSnapshot();
  });
});
