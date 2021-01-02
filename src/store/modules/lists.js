import { Message } from 'element-ui';
import * as userTags from '@/services/endpoints/UserTags';
import * as mangaEntries from '@/services/endpoints/v2/manga_entries';

// Can't access getter inside mutations, hence this has to be a plain function
export const getEntryIndex = (state, id) => state.entries.findIndex(
  (e) => e.id === id,
);

const state = {
  tags: [],
  entries: [],
  selectedEntries: [],
  entriesPagy: {},
  statuses: [
    { enum: 1, name: 'Reading' },
    { enum: 2, name: 'On Hold' },
    { enum: 3, name: 'Plan to Read' },
    { enum: 4, name: 'Completed' },
    { enum: 5, name: 'Dropped' },
  ],
  tagsLoading: false,
  entriesLoading: true,
  entriesUpdating: false,
  checkboxToggled: false,
};

const getters = {
  findEntryFromIDs: (state) => (ids) => state.entries.find(
    (entry) => ids.includes(entry.id),
  ),
  selectedEntriesIDs: (state) => state.selectedEntries.map((entry) => entry.id),
  selectionModeActive: (state) => state.selectedEntries.length > 0 && state.checkboxToggled,
};

const actions = {
  async getTags({ commit }) {
    const response = await userTags.index();
    const { status, data } = response;

    return status === 200 ? commit('setTags', data) : Message.error(data.error);
  },
  async getEntries({ commit }, { page, status, tagIDs, searchTerm, sort }) {
    commit('setEntriesLoading', true);

    const response = await mangaEntries.index(
      page, status, tagIDs, searchTerm, sort,
    );

    if (response.status === 200) {
      commit('setEntries', response.data.entries);
      commit('setEntriesPagy', response.data.pagy);
    } else {
      Message.error(response.data.error);
    }

    commit('setEntriesLoading', false);
  },
  async getEntriesPagy({ commit }, { page, status, tagIDs, searchTerm, sort }) {
    const response = await mangaEntries.pagyInfo(
      page, status, tagIDs, searchTerm, sort,
    );

    if (response.status === 200) {
      commit('setEntriesPagy', response.data);
    } else {
      Message.error(response.data.error);
    }
  },
};

const mutations = {
  setTags(state, data) {
    state.tags = data;
  },
  setEntries(state, data) {
    state.entries = data;
    state.selectedEntries = [];
  },
  setSelectedEntries(state, { entries, isCheckbox }) {
    state.checkboxToggled = isCheckbox;
    state.selectedEntries = entries;
  },
  setEntriesPagy(state, data) {
    state.entriesPagy = data;
  },
  addEntry(state, data) {
    state.entries.unshift(data);
  },
  addSelectedEntry(state, { entry, isCheckbox }) {
    state.checkboxToggled = isCheckbox;
    state.selectedEntries.push(entry);
  },
  updateEntry(state, data) {
    state.entries.splice(getEntryIndex(state, data.id), 1, data);
  },
  replaceEntry(state, { currentEntry, newEntry }) {
    state.entries.splice(getEntryIndex(state, currentEntry.id), 1, newEntry);
  },
  setTagsLoading(state, data) {
    state.tagsLoading = data;
  },
  setEntriesLoading(state, data) {
    state.entriesLoading = data;
  },
  setEntriesUpdating(state, data) {
    state.entriesUpdating = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
