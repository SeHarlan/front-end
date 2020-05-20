import React, { Component, useRef, useEffect, useState } from 'react';
import styles from './LineGraph.css';
// import JSONdata from '../../data/daily-test.json';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear } from 'd3';
import { useCovidData } from '../../hooks/covidHooks';

function formatDate(badDate) {
  return badDate.toString().slice(5, 6) + '/' + badDate.toString().slice(6);
}

function LineGraph() {
  
  const svgRef = useRef();
  const { dateData, positiveData } = useCovidData();
  
  useEffect(() => {
    if(!dateData || !positiveData) return;

    const svg = select(svgRef.current);
    
    const xScale = scaleLinear()
      .domain([0, positiveData.length - 1])
      .range([600, 0]);
    const yScale = scaleLinear()
      .domain([0, Math.max(...positiveData)])
      .range([400, 0]);
  
    const xAxis = axisBottom(xScale)
      .ticks(positiveData.length / 5)
      .tickFormat(index => formatDate(dateData[index]));
    const yAxis = axisRight(yScale)
      .ticks(positiveData.length / 5);

    svg
      .select('.x-axis')
      .style('transform', 'translateY(400px)')
      .call(xAxis);

    svg
      .select('.y-axis')
      .style('transform', 'translateX(600px)')
      .call(yAxis);

    
    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    svg
      .selectAll('.line')
      .data([positiveData])
      .join('path')
      .attr('class', 'line')
      .attr('d', value => myLine(value))
      .attr('fill', 'none')
      .attr('stroke', 'blue');
  }, [dateData, positiveData]);

  return (   
    <div className={styles.LineGraph}>
      <div>
        <h2>Total U.S. Positive Cases</h2>
        <svg ref={svgRef}>
          <g className='x-axis' />
          <g className='y-axis' />
        </svg>
        <br />
        <br />
        <br />
        <br />
        {/* <button onClick={() => setData(tempData.map(value => value + 5))}>Update Data</button>
        <button onClick={() => setData(tempData.filter(value => value < 35))}>Filter Data</button> */}
      </div>
    </div>
  );
}

export default LineGraph;
