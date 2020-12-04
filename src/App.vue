<template>

  <vis-section
    v-if="songData"
    :header-text="'Metric'">
    <div>
      Various quantifiable song metrics in a parallel-coordinate. Each vertical-axis can be "brushed" to create a cross-filter. Hover
      over the person in the legend to highlight their respective songs.

      Note Valence is a measure of how "happy" a song sounds
    </div>
    <parallel />
  </vis-section>

  <vis-section
    v-if="songData"
    :header-text="'Musical genres'">
    <div>
      How similar are the musical tastes. Construct a subgraph for each person and their top-N genres, then link these subgraphs together
      by the shared genres. The new graph is then recalculated with force-directed layout. Each person's node size reflects the diversity
      in their music genres. Hover over the small-nodes to see the genre types,
      click on each peron's node to toggle their "influence" area.
    </div>
    <bubble-force />
  </vis-section>

  <vis-section
    v-if="songData && vectorData"
    :header-text="'Lyrical similarity'">
    <div>
      How similiar are the song lyrics to each other. Using gensim to produce high-dimensional vector-embeddings, then use UMAP to
      reduce down to 3D space. Each circle represent a single submission and colour-coded with the individual's hue. Hoever over each
      circle to see the song title.
    </div>
    <scatter-plot />
  </vis-section>

  <vis-section
    v-if="songData && vectorData"
    :header-text="'Avatars'">
    <div> Personal avatars </div>
    <avatars />
  </vis-section>


  <vis-section
    v-if="songData"
    :header-text="'Playlist'">
    <div>
      Music of the day submission history. Just a listing of submissions that were recorded.
    </div>
    <listing />
  </vis-section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import VisSection from './components/vis-section';
import BubbleForce from './components/bubble-force';
import Parallel from './components/parallel';
import ScatterPlot from './components/scatter-plot';
import Listing from './components/listing';
import Avatars from './components/avatars';
import { loadSongData, loadLyricVectorData } from './util/loader';

export default {
  name: 'App',
  components: {
    VisSection,
    BubbleForce,
    Parallel,
    ScatterPlot,
    Listing,
    Avatars
  },
  setup() {
    console.log('Application setup');
    return {};
  },
  computed: {
    ...mapGetters({
      songData: 'songData',
      vectorData: 'vectorData'
    })
  },
  mounted() {
    loadSongData('./tracks.tsv').then(songData => {
      this.setSongData(songData);
    });
    loadLyricVectorData('./lyrics.tsv').then(data => {
      this.setVectorData(data);
    });
  },
  methods: {
    ...mapActions({
      setSongData: 'setSongData',
      setVectorData: 'setVectorData'
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
