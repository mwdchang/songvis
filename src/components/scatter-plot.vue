<template>
  <div ref="scatter" class="scatter-plot"/>
</template>

<script>
import * as d3 from 'd3';
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
      minDist: 0.2,
      nComponents: 3,
      nNeighbors: 15,
      spread: 1.0

      // Custom distance
      // distanceFn: manhattan
    });
    return {
      umap
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
        const trackId = this.vectorData.vectors[i].trackId;
        const song = this.songData.songs.find(s => s.trackId === trackId);
        if (song) {
          const c = d3.color(this.songData.colourScale(song.name));
          c.opacity = 0.7;
          return c.toString();
        }
        return '#888';
      },
      showLabelsOnHover: true,
      selectEnabled: false,
      renderMode: 'POINT'
    });

    const embedding = this.umap.fit(this.vectorData.vectors.map(d => d.vector));
    const metadata = embedding.map((e, i) => {
      const trackId = this.vectorData.vectors[i].trackId;
      let song = this.songData.songs.find(s => s.trackId === trackId);
      if (!song) song = {};
      return {
        labelIndex: i,
        label: `(${song.name}) - ${song.song}`
        // label: '!!! Test test test !!!'
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
  width: 90%;
  height: 380px;
}
</style>
