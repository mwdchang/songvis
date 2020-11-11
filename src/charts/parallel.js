import _ from 'lodash';
import * as d3 from 'd3';

export function createParallelCoord(ref, data, colourScale) {
  const svgW = 1000;
  const svgH = 450;

  const names = _.uniq(data.map(d => d.name));

  const margin = { top: 30, right: 30, bottom: 10, left: 30 };
  const width = svgW - margin.left - margin.right;
  const height = svgH - margin.top - margin.bottom;
  const y = {};
  const x = d3.scalePoint().range([0, width]).padding(0);

  const line = d3.line(); // .curve(d3.curveMonotoneX);

  const svg = d3.select(ref); // .attr('width', svgW).attr('height', svgH);
  const svgAdjusted = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  let actives = [];

  // const dimensions = ['releaseYear', 'duration', 'valence', 'energey', 'popularity'];
  const dimensions = ['releaseYear', 'duration', 'valence', 'energy', 'popularity'];

  dimensions.forEach(dim => {
    y[dim] = d3.scaleLinear()
      .domain(d3.extent(data, function(p) { return +p[dim]; }))
      .range([height, 0]);
  });
  x.domain(dimensions);


  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Add grey background lines for context.
  svgAdjusted.append('g')
    .attr('class', 'background')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .style('fill', 'none')
    .style('stroke-width', 2.0)
    .attr('d', path);

  // Add blue foreground lines for focus.
  const foreground = svgAdjusted.append('g')
    .attr('class', 'foreground')
    .selectAll('path')
    .data(data)
    .enter().append('path')
    .attr('d', path)
    .style('stroke', d => colourScale(d.name))
    .style('fill', 'none')
    .style('opacity', 0.5)
    .on('mouseover', (event, d) => {
      d3.selectAll('.background').selectAll('path').filter(p => p.name === d.name && d.song === p.song)
        .style('stroke-width', 5)
        .style('stroke', colourScale(d.name));
    })
    .on('mouseout', d => {
      svg.selectAll('.background').selectAll('path').style('stroke-width', 2.0).style('stroke', '#eee');
    });

  // Add a group element for each dimension.
  const g = svgAdjusted.selectAll('.dimension')
    .data(dimensions)
    .enter().append('g')
    .attr('class', 'dimension')
    .attr('transform', function(d) { return 'translate(' + x(d) + ')'; });

  g.append('g')
    .attr('class', 'axis')
    .each(function(d) {
      const axis = d3.axisLeft();
      if (d === 'releaseYear') {
        d3.select(this).call(axis.scale(y[d]).tickFormat(d3.format('0000')));
      } else {
        d3.select(this).call(axis.scale(y[d]));
      }
    })
    .append('text')
    .style('text-anchor', 'middle')
    .attr('y', -9)
    .style('stroke', 'none')
    .style('fill', '#000')
    .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append('g')
    .attr('class', 'brush')
    .each(function(d) {
      d3.select(this).call(y[d].brush = d3.brushY()
        .extent([[-10, 0], [10, height]])
        .on('brush', brush)
        .on('end', brush));
    })
    .selectAll('rect')
    .attr('x', -8)
    .attr('width', 16);


  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    actives = [];
    svg.selectAll('.brush')
      .filter(function(d) {
        y[d].brushSelectionValue = d3.brushSelection(this);
        return d3.brushSelection(this);
      })
      .each(function(d) {
        // Get extents of brush along each active selection axis (the Y axes)
        actives.push({
          dimension: d,
          extent: d3.brushSelection(this).map(y[d].invert)
        });
      });

    var selected = [];
    // Update foreground to only display selected values
    foreground.style('display', function(d) {
      const isActive = actives.every(function(active) {
        const result = active.extent[1] <= d[active.dimension] && d[active.dimension] <= active.extent[0];
        return result;
      });
      // Only render rows that are active across all selectors
      if (isActive) selected.push(d);
      return (isActive) ? null : 'none';
    });

    d3.selectAll('.person').selectAll('.marker').remove();
    if (selected.length > 0) {
      const count = {};
      names.forEach(name => {
        count[name] = 0;
      });

      selected.forEach(d => {
        count[d.name]++;
      });
      d3.selectAll('.person')
        .append('text')
        .classed('marker', true)
        .style('font-size', '12px')
        .attr('y', 10)
        .attr('x', 90)
        .text(d => count[d]);
    }
  }

  function createLegend() {
    const g = svg.append('g').attr('transform', `translate(${width + 80}, 30)`);

    const people = g.selectAll('.person')
      .data(names)
      .enter()
      .append('g')
      .classed('person', true)
      .attr('transform', (d, i) => {
        return 'translate(0' + ',' + i * 20 + ')';
      });

    people.append('rect')
      .attr('x', 5)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', d => colourScale(d));

    people.append('text')
      .attr('y', 10)
      .attr('x', 25)
      .style('stroke', 'none')
      .style('font-size', '12px')
      .text(d => d);

    const t = _.groupBy(data, d => d.name);
    people.append('text')
      .classed('marker', true)
      .style('font-size', '12px')
      .attr('y', 10)
      .attr('x', 90)
      .text(d => t[d].length);

    people.on('mouseenter', function(event, name) {
      if (actives.length > 0) return;

      d3.selectAll('.foreground')
        .selectAll('path')
        .filter(d => d.name !== name)
        .style('display', 'none');

      people.filter(d => d !== name).style('opacity', 0.5);
    });

    people.on('mouseout', function(event, name) {
      if (actives.length > 0) return;
      d3.selectAll('.foreground').selectAll('path').style('display', null);
      people.style('opacity', 1);
    });
  }

  createLegend();
}


