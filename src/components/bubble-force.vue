<template>
  <svg ref="bubbleforce" class="container"/>
</template>

<script>
import { mapGetters } from 'vuex';
import { createForce } from '../charts/force';

export default {
  name: 'BubbleForce',
  computed: {
    ...mapGetters({
      songData: 'songData'
    })
  },
  mounted() {
    const ref = this.$refs.bubbleforce;
    const graph = this.songData.graph;
    createForce(ref, graph.nodes, graph.edges, this.songData.colourScale);
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 450px;
}
</style>
