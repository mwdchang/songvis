<template>
  <vis-section
    v-if="songData"
    :header-text="'Musical taste'">
    <div>Taste in Music</div>
    <bubble-force />
  </vis-section>

  <!--
  <vis-section :header-text="'Lyrical similarity'">
    <div>How similiar are the lyrics</div>
    <scatter-plot />
  </vis-section>
  -->

  <vis-section :header-text="'Songs'">
    <div>Songs</div>
  </vis-section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import VisSection from './components/vis-section';
import BubbleForce from './components/bubble-force';
// import ScatterPlot from './components/scatter-plot';
import { loadSongData } from './util/loader';

export default {
  name: 'App',
  components: {
    VisSection,
    BubbleForce
    // ScatterPlot
  },
  setup() {
    console.log('Application setup');
    return {};
  },
  computed: {
    ...mapGetters({
      songData: 'songData'
    })
  },
  mounted() {
    loadSongData('./June2020.tsv').then(songData => {
      this.setSongData(songData);
    });
  },
  methods: {
    ...mapActions({
      setSongData: 'setSongData'
    })
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
