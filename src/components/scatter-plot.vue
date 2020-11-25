<template>
  <div style="display: flex">
    <div ref="scatter" class="scatter-plot"/>
    <div style="overflow: scroll; max-height: 360px; font-size: 85%; padding: 10px 5px; box-sizing: border-box">
      <div v-for="(v, k) of lyrics.split('  ')" :key="k">
        {{v}}
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import * as d3 from 'd3';
import { ref } from 'vue';
import { mapGetters } from 'vuex';
import { UMAP } from 'umap-js';
import { ScatterGL } from 'scatter-gl';

/*
const manhattan = (x, y) => {
  let r = 0;
  for (let i = 0; i < x.length; i++) {
    r += Math.abs(x[i] - y[i]);
  }
  return r;
};
*/

export default {
  name: 'ScatterPlot',
  props: {
  },
  setup(props) {
    const umap = new UMAP({
      minDist: 0.070,
      nComponents: 3,
      nNeighbors: 15,
      spread: 1.1

      // Custom distance
      // distanceFn: manhattan
    });

    const lyrics = ref('');
    return {
      umap, lyrics
    };
  },
  computed: {
    ...mapGetters({
      vectorData: 'vectorData',
      songData: 'songData'
    })
  },
  mounted() {
    const el = this.$refs.scatter;
    const scatterGL = new ScatterGL(el, {
      pointColorer: (i) => {
        const trackId = this.vectorData[i].trackId;
        const song = this.songData.songs.find(s => s.trackId === trackId);
        if (song) {
          const c = d3.color(this.songData.colourScale(song.name));
          c.opacity = 0.7;
          return c.toString();
        }
        return '#888';
      },
      onHover: (p) => {
        if (_.isNil(p)) return;
        this.lyrics = this.vectorData[p].lyrics;
        console.log('!!', this.lyrics.split('  ').length);
      },
      showLabelsOnHover: true,
      selectEnabled: false,
      renderMode: 'POINT'
    });

    const embedding = this.umap.fit(this.vectorData.map(d => d.vector));
    const metadata = embedding.map((e, i) => {
      const trackId = this.vectorData[i].trackId;
      let song = this.songData.songs.find(s => s.trackId === trackId);
      if (!song) song = {};
      return {
        labelIndex: i,
        label: `(${song.name}) - ${song.song}`
      };
    });

    const dataset = new ScatterGL.Dataset(embedding, metadata);
    scatterGL.render(dataset);
    scatterGL.resize();
  }
};
</script>

<style lang="scss">
.scatter-plot {
  position: relative; // scatter-gl has a secondary label-canvas layer that is absolute
  width: 50%;
  height: 380px;
}
</style>
