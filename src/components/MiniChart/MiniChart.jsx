import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, scaleOrdinal, schemeCategory10, min, max } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';
import { Typography, makeStyles } from '@material-ui/core';
import styles from '../../styles/Chart.css';


export function MiniChart({ dataset, property }) {
  
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
 
  function formatDate(badDate) {
    return badDate.toString().slice(6, 7) + '/' + badDate.toString().slice(8, 10);
  }  

  useEffect(() => {
    if(!dataset || !dataset.date) {
      console.log('No data, exiting useEffect()');
      return;
    }

    const svg = select(svgRef.current);

    // Setup variables and viewBox for responsive display
    // const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    // const { width } = dimensions || wrapperRef.current.getBoundingClientRect();
    // const height = width / 2;
    const width = 500;
    const height = 250;
    const margin = { top: 20, right: 40, bottom: 30, left: 0 };

    svg
      .attr('viewBox', `0, 0, ${width}, ${height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    // Define scales
    const xScale = scaleLinear()
      .domain([0, dataset['date'].length - 1]) // range of data
      .range([margin.left, width - margin.right]); // range of pixels
    const yScale = scaleLinear()
      .domain([-100, 100])
      .range([height - margin.bottom, margin.top]);
  
    // Define axis
    const xAxis = axisBottom(xScale)
      .ticks(dataset['date'].length / 10)
      .tickFormat(index => formatDate(dataset.date[index]));
    const yAxis = axisRight(yScale)
      .ticks(height / 40);
    

    // Draw axis on pre-existing elements
    svg
      .select(`.${styles.xAxis}`)
      .style('transform', `translateY(${height - margin.bottom}px)`)
      .call(xAxis);
    svg
      .select(`.${styles.yAxis}`)
      .style('transform', `translateX(${width - margin.right}px)`)
      .call(yAxis);

    // Draw background on pre-existing element
    svg
      .select(`.${styles.chartBackground}`)  
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', 'none')
      .attr('class', styles.chartBackground);

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
    <div className={styles.Chart}>
      <Typography variant="h5">{property.description}</Typography>
      <div ref={wrapperRef} className={styles.container}>
        <svg ref={svgRef}>
          <g className={styles.xAxis} />
          <g className={styles.yAxis} />
          <rect className={styles.chartBackground} />
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
