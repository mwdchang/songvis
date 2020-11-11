import _ from 'lodash';
import * as d3 from 'd3';

const loadSongData = async (url) => {
  const data = await d3.tsv(url);

  // Deserialize
  data.forEach(d => {
    d.relatedArtists = d.relatedArtists.split('|');
    d.artistGenres = d.artistGenres.split('|');
  });

  const names = _.uniq(data.map(d => d.name));
  const related = {};

  // Compute relatedness
  names.forEach(name => {
    related[name] = {
      rawGenres: [],
      genres: [],
      genresIntersect: {}
    };
  });

  data.forEach(d => {
    related[d.name].rawGenres = related[d.name].rawGenres.concat(d.artistGenres);
    related[d.name].genres = _.uniq(related[d.name].genres.concat(d.artistGenres));
  });

  names.forEach(n1 => {
    names.forEach(n2 => {
      if (n1 === n2) return; // self
      related[n1].genresIntersect[n2] = _.intersection(related[n1].genres, related[n2].genres);
    });
  });

  // Create graph
  const nodes = [];
  const edges = [];

  names.forEach(name => {
    const groupedGenres = _.groupBy(related[name].rawGenres);

    const list = Object.entries(groupedGenres).map(([k, v]) => {
      return {
        genre: k,
        count: v.length
      };
    }).filter(d => d.genre !== '');

    // Person's favourite genre
    const mostLikedGenres = _.take(_.orderBy(list, d => -d.count), 5);
    mostLikedGenres.forEach(g => {
      edges.push({
        source: name,
        target: g.genre,
        value: g.count
      });
    });

    // Register person as a node
    nodes.push({
      id: name,
      type: 'person',
      numGenres: Object.keys(list).length
    });
  });
  _.uniq(edges.map(d => d.target)).forEach(genre => {
    nodes.push({
      id: genre,
      type: 'genre'
    });
  });

  // console.log(names);
  // console.log('songdata', data);
  return {
    songs: data,
    graph: { nodes, edges },
    names
  };
};

export {
  loadSongData
};
