<template>
  <div style="display:flex; flex-wrap: wrap">
    <div v-for="(name, i) in names"
      :ref="el => { divs[i] = el }"
      :key="name"
      class="avatar">
      <div style="position: absolute">{{name}}</div>
      <svg style="width:100%; height: 100%" />
    </div>
  </div>
</template>


<script>
import _ from 'lodash';
import { ref } from 'vue';
import { mapGetters } from 'vuex';
import { createRadar } from '../charts/radar';

export default {
  name: 'Avatars',
  setup() {
    const divs = ref([]);
    return { divs };
  },
  computed: {
    ...mapGetters({
      songData: 'songData'
    }),
    names() {
      return _.uniq(this.songData.songs.map(d => d.name));
    },
    stats() {
      const r = [];
      const dimensions = ['duration', 'valence', 'energy', 'danceability', 'popularity', 'tempo'];

      // https://composition-api.vuejs.org/api.html#template-refs
      for (let i = 0; i < dimensions.length; i++) {
        const attrs = this.songData.songs.map(s => s[dimensions[i]]);
        r.push({
          name: dimensions[i],
          max: Math.max(...attrs),
          min: Math.min(...attrs)
        });
      }
      console.log(r);
      return r;
    }
  },
  mounted() {
    this.divs.forEach((divEl, i) => {
      const data = this.songData.songs.filter(s => s.name === this.names[i]);
      createRadar(divEl.querySelector('svg'), this.names[i], data, this.stats, this.songData.colourScale);
    });
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 260px;
  height: 260px;
  margin: 10px 20px;
}
</style>
