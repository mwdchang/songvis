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
    console.log('!!', this.songData.graph.edges);
    const ref = this.$refs.bubbleforce;
    const graph = this.songData.graph;
    createForce(ref, graph.nodes, graph.edges);
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 450px;
}
</style>
