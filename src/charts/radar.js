import * as d3 from 'd3';

export function createRadar(ref, name, songData, stats, colourScale) {
  const svg = d3.select(ref);
  const chart = svg.append('g');

  // chart.append('circle').attr('cx', 50).attr('cy', 50).attr('r', 1).attr('fill', 'red');

  const scales = new Map();
  for (let i = 0; i < stats.length; i++) {
    const attr = stats[i];
    scales.set(attr.name, d3.scaleLinear().domain([attr.min, attr.max]).range([5, 105]));
  }

  const c = 130;
  const deg = 360 / stats.length;
  const line = d3.line().x(d => d.x).y(d => d.y);

  const random = () => (Math.random() - 0.5) * 2;

  for (let s = 0; s < songData.length; s++) {
    const song = songData[s];
    const path = [];
    for (let i = 0; i < stats.length; i++) {
      const stat = stats[i];
      console.log(stat.name);
      const r = scales.get(stat.name)(song[stat.name]);
      path.push({
        x: c + Math.cos(i * (deg + random()) * Math.PI / 180) * r,
        y: c + Math.sin(i * (deg + random()) * Math.PI / 180) * r
      });
    }
    chart.append('polygon')
      .attr('points', path.map(d => `${d.x},${d.y}`).flat())
      .attr('fill', d3.rgb(colourScale(name)).brighter(1.2))
      .attr('fill-opacity', 0.2)
      .attr('stroke', colourScale(name))
      .attr('stroke-opacity', 0.5);
  }

  for (let i = 0; i < stats.length; i++) {
    chart.append('path')
      .attr('d', line([{ x: c, y: c }, { x: c + Math.cos(i * deg * Math.PI / 180) * 85, y: c + Math.sin(i * deg * Math.PI / 180) * 85 }]))
      .attr('fill', 'none')
      .attr('stroke-width', 2.0)
      .attr('stroke', '#888')
      .attr('stroke-opacity', 0.7)
      .attr('stroke-dasharray', 2);

    chart.append('text')
      .attr('x', c + Math.cos(i * deg * Math.PI / 180) * 95)
      .attr('y', c + Math.sin(i * deg * Math.PI / 180) * 95)
      .attr('text-anchor', 'middle')
      .style('font-size', '70%')
      .style('fill', '#555')
      .text(stats[i].name);
  }
};
