import _ from 'lodash';
import * as d3 from 'd3';
import { addPadding, createOutline } from 'bubblesets-js';

const personR = 2;
const nonPersonR = 5;


// hack
const colourScale = () => '#f80';

// A path generator
export const pathFn = d3.line()
  .x(d => d.x)
  .y(d => d.y);

export function createForce(ref, nodes, edges) {
  const svg = d3.select(ref); // .attr('width', width).attr('height', height);
  const forceBackground = svg.append('g');

  const boundingBox = svg.node().getBoundingClientRect();
  const width = boundingBox.width;
  const height = boundingBox.height;


  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function(d) { return d.id; }))
    .force('charge', d3.forceManyBody())
    .force('collide', d3.forceCollide(25))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const valueExtent = edges.map(d => d.value);
  const scaleOpacity = d3.scaleLinear().domain(valueExtent).range([0.1, 0.5]);

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(edges)
    .enter()
    .append('line')
    .style('stroke', '#AAA')
    .style('stroke-width', d => {
      return 2;
    })
    .style('opacity', d => {
      return 0.4 + scaleOpacity(d.value);
    });

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodes)
    .enter().append('g');

  node.filter(d => d.type === 'person')
    .on('click', function(d) {
      if (d3.event.defaultPrevented) return;

      const selection = forceBackground.selectAll('.bubbleset').filter(x => x.id === d.id);
      if (selection.size() > 0) {
        selection.remove();
      } else {
        bubbleset(d.id);
      }
    });

  node.append('circle')
    .attr('r', function(d) {
      if (d.type === 'person') {
        return personR * Math.sqrt(d.numGenres);
      }
      return nonPersonR;
    })
    .attr('fill', function(d) {
      if (d.type === 'person') {
        return colourScale(d.id);
      }
      return '#CCC';
    })
    .style('fill-opacity', 0.75)
    .style('cursor', function(d) {
      if (d.type === 'person') {
        return 'pointer';
      }
      return 'crosshair';
    })
    .on('mouseover', function(d) {
      if (d.type !== 'person') {
      } else {
      }
    })
    .on('mouseleave', function() {
    })
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.filter(d => d.type === 'person')
    .append('text')
    .attr('x', 18)
    .attr('y', 5)
    .text(function(d) {
      return d.id;
    });


  function bubbleset(name, colour) {
    // const bubbles = new BubbleSets();

    const related = edges.filter(e => e.source.id === name).map(e => e.target.id);
    // const connectedPersons = edges.filter(e => related.indexOf(e.target.id) >= 0).map(e => e.source.id);
    // let group = [...related, ...connectedPersons];
    const group = [name, ...related];

    const inSet = node.filter(d => group.includes(d.id)).data().map(d => {
      const x = d.x;
      const y = d.y;
      const r = d.type === 'person' ? personR : nonPersonR;
      return {
        x: x - 0.5 * r,
        y: y - 0.5 * r,
        width: r,
        height: r
      };
    });

    const outSet = node.filter(d => !group.includes(d.id)).data().map(d => {
      const x = d.x;
      const y = d.y;
      const r = d.type === 'person' ? personR : nonPersonR;
      return {
        x: x - 0.5 * r,
        y: y - 0.5 * r,
        width: r,
        height: r
      };
    });

    /*
    const lines = edges.filter(d => d.source.id === name).map(e => {
      return {
        x1: e.source.x,
        y1: e.source.y,
        x2: e.target.x,
        y2: e.target.y
      }
    });
    */

    const padding = 1;
    const list = createOutline(
      addPadding(inSet, padding),
      addPadding(outSet, padding),
      [], // edges
      {} // options
    ).sample(4);

    /*
    const outline = new PointPath(list).transform([
      new ShapeSimplifier(0.0),
      new BSplineShapeGenerator(),
      new ShapeSimplifier(0.0),
    ]);
    */

    // const outline = new PointPath(list).sample(2); // .simplify(0).bSplines().simplify(0);

    forceBackground.append('path')
      .datum({ id: name })
      .classed('bubbleset', true)
      .attr('d', pathFn(list.points))
      .style('stroke', colourScale(name))
      .style('stroke-opacity', 0.4)
      .style('fill', colourScale(name))
      .style('fill-opacity', 0.15);
  }

  simulation.nodes(nodes).on('tick', ticked);
  simulation.force('link').links(edges);
  simulation.on('end', function() {
  });


  function ticked() {
    link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

    node.attr('transform', function(d) {
      const padding = 30;
      d.x = Math.max(padding, Math.min(d.x, width - padding));
      d.y = Math.max(padding, Math.min(d.y, height - padding));
      return 'translate(' + d.x + ',' + d.y + ')';
    });

    const names = forceBackground.selectAll('.bubbleset').data().map(d => d.id);
    forceBackground.selectAll('.bubbleset').remove();
    names.forEach(bubbleset);
    /*
    */
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  const names = nodes.filter(d => d.type === 'person').map(d => d.id);
  const shuffled = _.shuffle(names);

  bubbleset(shuffled[0]);
  bubbleset(shuffled[1]);
}

