import React, { useRef, useEffect, useState } from 'react';
import styles from './LineGraph.css';
// import JSONdata from '../../data/daily-test.json';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear } from 'd3';
import { useCovidData } from '../../hooks/covidHooks';

function formatDate(badDate) {
  return badDate.toString().slice(5, 6) + '/' + badDate.toString().slice(6);
}

const selectOptions = (myObj) => {
  const myKeys = Object.keys(myObj);
  return myKeys.map((myKey, i) => <option key={i} value={myKey}>{myKey}</option>);
};

function LineGraph() {
  
  const svgRef = useRef();
  const [property, setProperty] = useState('positive');
  const { dateData, positiveData, recoveredData, deathData } = useCovidData();
  const covidData = { date: dateData, positive: positiveData, recovered: recoveredData, death: deathData };

  useEffect(() => {
    if(!dateData || !positiveData || !recoveredData || !deathData) return;

    const svg = select(svgRef.current);
    
    const xScale = scaleLinear()
      .domain([0, covidData[property].length - 1])
      .range([600, 0]);
    const yScale = scaleLinear()
      .domain([0, Math.max(...covidData['positive'])])
      .range([400, 0]);
  
    const xAxis = axisBottom(xScale)
      .ticks(covidData[property].length / 5)
      .tickFormat(index => formatDate(dateData[index]));
    const yAxis = axisRight(yScale)
      .ticks(covidData[property].length / 5);

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
      .data([covidData[property]])
      .join('path')
      .attr('class', 'line')
      .attr('d', value => myLine(value))
      .attr('fill', 'none')
      .attr('stroke', 'blue');
  }, [covidData]);

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
        <select value={property} onChange={({ target }) => setProperty(target.value)}>
          {selectOptions(covidData)}
          {/* <option value="positive">Total Positive Cases</option>
          <option value="recovered">Current Cases</option>
          <option value="death">Deaths</option> */}
        </select>
      </div>
    </div>
  );
}

export default LineGraph;
