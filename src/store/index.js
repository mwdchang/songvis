import { createStore } from 'vuex';

export default createStore({
  state: {
    songData: null,
    vectorData: null
  },
  getters: {
    songData(state) {
      return state.songData;
    },
    vectorData(state) {
      return state.vectorData;
    }
  },
  mutations: {
    setSongData(state, songData) {
      state.songData = songData;
    },
    setVectorData(state, vectorData) {
      state.vectorData = vectorData;
    }
  },
  actions: {
    setSongData({ commit }, songData) {
      commit('setSongData', songData);
    },
    setVectorData({ commit }, vectorData) {
      commit('setVectorData', vectorData);
    }
  },
  modules: {
  }
});
