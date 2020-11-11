<template>
  <div ref="scatter" class="scatter-plot"/>
</template>

<script>
import { UMAP } from 'umap-js';
import { ScatterGL } from 'scatter-gl';

const testData = [];
const s = 250;

// X
for (let i = 0; i < s; i++) {
  testData.push([Math.random(), Math.random() * 0.1, Math.random() * 0.8]);
}
// Y
for (let i = 0; i < s; i++) {
  testData.push([Math.random() * 0.2, Math.random(), Math.random() * 0.8]);
}
// Z
for (let i = 0; i < s; i++) {
  testData.push([Math.random() * 0.1, Math.random() * 0.1, Math.random()]);
}

const manhattan = (x, y) => {
  let r = 0;
  for (let i = 0; i < x.length; i++) {
    r += Math.abs(x[i] - y[i]);
  }
  return r;
};



export default {
  name: 'ScatterPlot',
  props: {
  },
  setup(props) {
    const umap = new UMAP({
      minDist: 0.2,
      nComponents: 3,
      nNeighbors: 15,
      spread: 1.0,

      // Custom
      distanceFn: manhattan
    });
    const embedding = umap.fit(testData);
    return {
      embedding
    };
  },
  mounted() {
    const el = this.$refs.scatter;
    const scatterGL = new ScatterGL(el, {
      pointColorer: (i) => {
        if (i < s) return '#d00';
        if (i < s * 2) return '#0d0';
        return '#00d';
      }
    });
    const dataset = new ScatterGL.Dataset(this.embedding);
    scatterGL.render(dataset);
    scatterGL.resize();
  }
};
</script>

<style scoped lang="scss">
.scatter-plot {
  width: 90%;
  height: 380px;
}
</style>
