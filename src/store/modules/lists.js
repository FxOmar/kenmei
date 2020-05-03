import { Message } from 'element-ui';
import { secure } from '@/modules/axios';

// Can't access getter inside mutations, hence this has to be a plain function
export const getEntryIndex = (state, id) => state.entries.findIndex(
  (e) => e.id === id
);

const state = {
  lists: [],
  entries: [],
  listsLoading: false,
};

const getters = {
  // TODO: Rename to getEntriesByTagIDs when renaming manga lists to tags
  getEntriesByListIDs: (state) => (listIDs) => state.entries.filter(
    (entry) => !listIDs.length || listIDs.includes(entry.manga_list_id.toString())
  ),
  findListByID: (state) => (id) => state.lists.find((list) => list.id === id),
  findEntryFromIDs: (state) => (ids) => state.entries.find(
    (entry) => ids.includes(entry.id)
  ),
};

const actions = {
  getLists({ commit }) {
    return secure.get('/api/v1/manga_lists/')
      .then((response) => {
        commit('setLists', response.data.data);
      })
      .catch((request) => { Message.error(request.response.data.error); });
  },
  getEntries({ commit }) {
    return secure.get('/api/v1/manga_entries/')
      .then((response) => {
        commit('setEntries', response.data.data);
      })
      .catch((request) => { Message.error(request.response.data.error); });
  },
};

const mutations = {
  setLists(state, data) {
    state.lists = data;
  },
  setEntries(state, data) {
    state.entries = data;
  },
  addEntry(state, data) {
    state.entries.push(data);
  },
  updateEntry(state, data) {
    state.entries.splice(getEntryIndex(state, data.id), 1, data);
  },
  replaceEntry(state, { currentEntry, newEntry }) {
    state.entries.splice(getEntryIndex(state, currentEntry.id), 1, newEntry);
  },
  removeEntries(state, entryIDs) {
    state.entries = state.entries.filter(
      (mangaEntry, _index, _arr) => !entryIDs.includes(mangaEntry.id)
    );
  },
  setListsLoading(state, data) {
    state.listsLoading = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
