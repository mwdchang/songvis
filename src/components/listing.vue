<template>
  <div style="display:flex; justify-content: space-around">
    <table>
      <tr v-for="(song , i) of songData.songs" :key="song.trackId">
        <td>{{i}}</td>
        <td>{{song.name}}</td>
        <td><a :href="'https://open.spotify.com/track/' + song.trackId">{{truncate(song.song)}}</a></td>
        <td>{{song.releaseYear}}</td>
        <td>{{truncate(song.artist)}}</td>
      </tr>
    </table>
    <table>
      <tr>
        <td> Total duration (minutes) </td>
        <td> {{ totalDuration.toFixed() }} </td>
      </tr>
      <tr>
        <td> Total songs </td>
        <td> {{ totalSongs }} </td>
      </tr>
      <tr>
        <td> Total artists</td>
        <td> {{ totalArtists }} </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ref } from 'vue';

export default {
  name: 'Listing',
  setup() {
    const totalDuration = ref(0);
    const totalSongs = ref(0);
    const totalArtists = ref(0);

    return {
      totalDuration,
      totalSongs,
      totalArtists
    };
  },
  computed: {
    ...mapGetters({
      songData: 'songData'
    })
  },
  mounted() {
    const songMap = new Map();
    const artistMap = new Map();

    this.songData.songs.forEach(s => {
      const trackId = s.trackId;
      const artist = s.artist;

      this.totalDuration += +s.duration;

      if (songMap.has(trackId)) {
        songMap.set(trackId, songMap.get(trackId) + 1);
      } else {
        songMap.set(trackId, 0);
      }
      if (artistMap.has(artist)) {
        artistMap.set(artist, artistMap.get(artist) + 1);
      } else {
        artistMap.set(artist, 0);
      }
    });

    this.totalSongs = songMap.size;
    this.totalArtists = artistMap.size;
  },
  methods: {
    truncate(s) {
      if (s.length > 50) {
        return s.substring(0, 46) + '...';
      }
      return s;
    }
  }
};
</script>

<style scoped lang="scss">
table, th, td {
  border: 1px solid #DDD;
}
table {
  font-size: 85%;
  border-collapse: collapse;
  border-spacing: 10px;
}
td {
  padding: 2px 4px;
}
</style>
