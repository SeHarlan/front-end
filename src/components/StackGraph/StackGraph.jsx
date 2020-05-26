import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './StackGraph.css';
import { select, max, scaleLinear, scaleBand, axisBottom, stackOrderAscending, stack, axisLeft } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';

function StackGraph({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const legendRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  console.log(data);

  const dataStructure = data.date.reduce((acc, date, i) => {
    acc.push({ 
      countryCode: data.countryCode,
      countryName: data.countryName,
      date,
      newCases: data.newCases[i],
      newDeaths: data.newDeaths[i],
      newRecovered: data.newRecovered[i],
      totalDeaths: data.totalDeaths[i],
      totalCases: data.totalCases[i],
      totalRecovered: data.totalRecovered[i]
    });
    return acc;
  }, []);
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const keys = [
      'newCases',
      'newDeaths',
      'newRecovered',
      'totalCases',
      'totalDeaths',
      'totalRecovered'];

    const colors = {
      'newCases': 'DarkSeaGreen',
      'newDeaths': 'DeepSkyBlue',
      'newRecovered': 'DarkViolet',
      'totalCases': 'DarkSlateBlue',
      'totalDeaths': 'Aquamarine',
      'totalRecovered': 'DarkCyan'
    };
    // stacks / layers
    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderAscending);
    const layers = stackGenerator(dataStructure);
    const extent = [
      0,
      max(layers, layer => max(layer, sequence => sequence[1]))
      // look at highest value in layer array, compare with all key layers for highest
      // second value of each array to calculate max
    ];

    // scales
    const xScale = scaleBand()
      .domain(dataStructure.map(d => d.date))
      .range([0, width])
      .padding(0.25);
      //scale band given explicit years
    
    const yScale = scaleLinear()
      .domain(extent)
      .range([height, 0]);
      //origin of svg at top is 0
      // scale linear continuous range of values

    // rendering
    svg
      .selectAll('.layer')
      .data(layers)
      .join('g')
      .attr('class', 'layer')
      .attr('fill', layer => colors[layer.key])
      .selectAll('rect')
      .data(layer => layer)
      .join('rect') //creates new rect for each layer
      .attr('x', sequence => xScale(sequence.data.date)) // width of each rect
      .attr('width', xScale.bandwidth())
      .attr('y', sequence => yScale(sequence[1])) //top edge of rect, determined by [1]
      .attr('height', sequence => yScale(sequence[0]) - yScale(sequence[1]));
    // create all layers of data, stack keys
    // data for rectangles is layer

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select('.x-axis')
      .attr('transform', `translate(0, ${height})`)
      .style('fill', 'black')
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg
      .select('.y-axis')
      .call(yAxis);

    const legend = select(legendRef.current)
      .attr('class', 'legendColor');

    // const legendText = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

    // const legends = legend.selectAll('span')
    //   .data([-100, -75, -50, -25, 0, 25, 50, 75, 100]);

    // keys.join('span')
    //   .attr('class', 'legendSpan')
    //   .style('background', (d) => colorScale(d))
    // // .text(legendText.forEach(number => number));
    //   .text((d, i) => legendText[i]);
      
  }), [data, dimensions];

  return (   
    <div className={styles.StackGraph}>
      <div ref={wrapperRef} className={styles.container}>
        <svg className="svg" ref={svgRef}>
          <g className='x-axis'/>
          <g className='y-axis'/>
        </svg>
      </div>
      <div className="legend" ref={legendRef}>Bar Chart legend:</div>
    </div>
  );
}


StackGraph.propTypes = {
  data: PropTypes.object.isRequired,
};

export default StackGraph;
