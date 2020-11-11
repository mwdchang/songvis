import { createStore } from 'vuex';

export default createStore({
  state: {
    songData: null
  },
  getters: {
    songData(state) {
      return state.songData;
    }
  },
  mutations: {
    setSongData(state, songData) {
      state.songData = songData;
    }
  },
  actions: {
    setSongData({ commit }, songData) {
      commit('setSongData', songData);
    }
  },
  modules: {
  }
});
