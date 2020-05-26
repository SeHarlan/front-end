import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './MiniChart.css';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, scaleOrdinal, schemeCategory10, min, max } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';


export function MiniChart({ dataSet }) {
  
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const checkedOptions = 'retailChange';
 
  function formatDate(badDate) {
    return badDate.toString().slice(6, 7) + '/' + badDate.toString().slice(8, 10);
  }
  
  const filteredData = (data, selectedKeys) => {
    // Refactor this
    const newArr = [];
    selectedKeys.map(item => { 
      if(data[item]); 
      newArr.push(data[item]);
    });
    return newArr;
  }; 

  const filteredKeys = (data) => {
    const keys = Object.keys(data);
    // Refactor: Apparently, item !== ('date' || 'countryCode' || 'countryName') doesn't work?
    return keys.filter(item => (item !== 'date' && item !== 'countryCode' && item !== 'countryName'));
  };
  

  useEffect(() => {
    if(!dataSet || !dataSet.date) {
      console.log('No data, exiting useEffect()');
      return;
    }

    const svg = select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    // Define scales
    const yAxisMin = min(dataSet.totalCases ?? -100);
    const yAxisMax = max(dataSet.totalCases ?? 100);

    const xScale = scaleLinear()
      .domain([0, dataSet['date'].length - 1]) // range of data
      .range([0, width]); // range of pixels
    const yScale = scaleLinear()
      .domain([yAxisMin, yAxisMax])
      .range([height, 0]);
    const colorScale = scaleOrdinal(schemeCategory10)
      .domain(filteredKeys(dataSet));
  
    // Define axis
    const xAxis = axisBottom(xScale)
      .ticks(dataSet['date'].length / 5)
      .tickFormat(index => formatDate(dataSet.date[index]));
    const yAxis = axisRight(yScale)
      .ticks(height / 20);

    // Draw axis on pre-existing elements
    svg
      .select('.x-axis')
      .style('transform', `translateY(${height}px)`)
      .call(xAxis);
    svg
      .select('.y-axis')
      .style('transform', `translateX(${width}px)`)
      .call(yAxis);

    // Define line
    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    // Draw line
    svg
      .selectAll(`.graphLine-${dataSet.countryName}`)
      .data(dataSet['retailChange'])
      .join('path')
      .attr('class', `graphLine-${dataSet.countryName}`)
      .attr('d', value => myLine(value))
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d));

  }, [dataSet, checkedOptions]);

  return (   
    <div className={styles.MiniChart}>
      <div ref={wrapperRef} className={styles.container}>
        <svg ref={svgRef}>
          <g className='x-axis' />
          <g className='y-axis' />
        </svg>
      </div>
    </div>
  );
}

MiniChart.propTypes = {
  dataSet: PropTypes.object.isRequired
};


export default MiniChart;
