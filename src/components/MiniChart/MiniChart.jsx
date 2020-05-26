import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, scaleOrdinal, schemeCategory10, min, max } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';
import { Typography, makeStyles } from '@material-ui/core';
import { useStyles } from './MiniChart.styles.js';
import styles from './MiniChart.css';
import './MiniChartSVG.css';


export function MiniChart({ dataset, property }) {
  
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const classes = useStyles();
 
  function formatDate(badDate) {
    return badDate.toString().slice(6, 7) + '/' + badDate.toString().slice(8, 10);
  }  

  useEffect(() => {
    if(!dataset || !dataset.date) {
      console.log('No data, exiting useEffect()');
      return;
    }

    const svg = select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    console.log({ width, height });
    const viewBoxWidth = 500;
    const viewBoxHeight = 250;
    const margin = { top: 20, right: 40, bottom: 30, left: 0 };

    svg
      .attr('viewBox', `0, 0, ${viewBoxWidth}, ${viewBoxHeight}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    // Define scales
    const xScale = scaleLinear()
      .domain([0, dataset['date'].length - 1]) // range of data
      .range([margin.left, viewBoxWidth - margin.right]); // range of pixels
    const yScale = scaleLinear()
      .domain([-100, 100])
      .range([viewBoxHeight - margin.bottom, margin.top]);
  
    // Define axis
    const xAxis = axisBottom(xScale)
      .ticks(dataset['date'].length / 10)
      .tickFormat(index => formatDate(dataset.date[index]));
    const yAxis = axisRight(yScale)
      .ticks(viewBoxHeight / 40);
    

    // Draw axis on pre-existing elements
    svg
      .select('.x-axis')
      .style('transform', `translateY(${viewBoxHeight - margin.bottom}px)`)
      .call(xAxis);
    svg
      .select('.y-axis')
      .style('transform', `translateX(${viewBoxWidth - margin.right}px)`)
      .call(yAxis);

    // Draw background
    svg
      .append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', viewBoxWidth - margin.left - margin.right)
      .attr('height', viewBoxHeight - margin.top - margin.bottom)
      .attr('fill', '#f6f6f6')
      .attr('class', 'chartBackground');

    // Define line
    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    // Draw line
    svg
      .selectAll('.graphLine')
      .data([dataset[property.key]])
      .join('path')
      .attr('class', 'graphLine')
      .attr('d', value => myLine(value))
      .attr('fill', 'none')
      .attr('stroke', 'red');

  }, [dataset]);

  return (   
    <div className={styles.MiniChart}>
      <Typography variant="h5">{property.description}</Typography>
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
  dataset: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired
};


export default MiniChart;
