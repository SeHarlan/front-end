import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './StackGraph.css';
import { select, max, scaleLinear, scaleBand, axisBottom, stackOrderAscending, stack, axisLeft } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';

function StackGraph({ dataSet }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const data = [
      {
        countryCode: null,
        countryName: 'Worldwide',
        date: '2020-01-21T08:00:00.000Z',
        id: 338996,
        latitude: null,
        longitude: null,
        newCases: 51,
        newDeaths: 10,
        newRecovered: 50,
        subRegion1: null,
        subRegion2: null,
        totalCases: 313,
        totalDeaths: 320,
        totalRecovered: 363,
        __v: 0,
        _id: '5ec57e71617e67711a139e4e'
      },
      {
        countryCode: null,
        countryName: 'Worldwide',
        date: '2020-01-22T08:00:00.000Z',
        id: 338996,
        latitude: null,
        longitude: null,
        newCases: 51,
        newDeaths: 40,
        newRecovered: 24,
        subRegion1: null,
        subRegion2: null,
        totalCases: 462,
        totalDeaths: 60,
        totalRecovered: 264,
        __v: 0,
        _id: '5ec57e71617e67711a139e4e'
      },
      {
        countryCode: null,
        countryName: 'Worldwide',
        date: '2020-01-23T08:00:00.000Z',
        id: 338996,
        latitude: null,
        longitude: null,
        newCases: 514,
        newDeaths: 246,
        newRecovered: null,
        subRegion1: null,
        subRegion2: null,
        totalCases: 313,
        totalDeaths: 426,
        totalRecovered: 266,
        __v: 0,
        _id: '5ec57e71617e67711a139e4e'
      }
    ];

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
    const layers = stackGenerator(data);
    const extent = [
      0,
      max(layers, layer => max(layer, sequence => sequence[1]))
      // look at highest value in layer array, compare with all key layers for highest
      // second value of each array to calculate max
    ];

    // scales
    const xScale = scaleBand()
      .domain(data.map(d => d.date))
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

  }), [dataSet, dimensions];

  return (   
    <div className={styles.LineGraph}>
      <div ref={wrapperRef} className={styles.container}>
        <svg ref={svgRef}>
          <g className='x-axis' style={{ color: 'black' }}/>
          <g className='y-axis'/>
        </svg>
      </div>
    </div>
  );
}


StackGraph.propTypes = {
  dataSet: PropTypes.object.isRequired,
};

export default StackGraph;
