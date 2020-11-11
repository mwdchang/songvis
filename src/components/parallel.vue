<template>
  <svg ref="parallel" class="container"/>
</template>

<script>
import { mapGetters } from 'vuex';
import { createParallelCoord } from '../charts/parallel';

export default {
  name: 'Parallel',
  computed: {
    ...mapGetters({
      songData: 'songData'
    })
  },
  mounted() {
    const ref = this.$refs.parallel;
    createParallelCoord(ref, this.songData.songs, this.songData.colourScale);
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 450px;
}
</style>
