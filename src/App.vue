<template>
  <vis-section :header-text="'Musical taste'">
    <div>Taste in Music</div>
  </vis-section>
  <vis-section :header-text="'Lyrical similarity'">
    <div>How similiar are the lyrics</div>
    <scatter-plot />
  </vis-section>

  <vis-section :header-text="'Songs'">
    <div>Songs</div>
  </vis-section>
</template>

<script>
import VisSection from './components/vis-section';
import ScatterPlot from './components/scatter-plot';

export default {
  name: 'App',
  components: {
    VisSection,
    ScatterPlot
  },
  setup() {
    console.log('Application setup');
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
