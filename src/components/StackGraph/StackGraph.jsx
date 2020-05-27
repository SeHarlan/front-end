import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Chart.css';
import { select, max, scaleLinear, scaleBand, axisBottom, stackOrderAscending, stack, axisLeft } from 'd3';

import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useStyles } from './stackedGraph.styles';



function StackGraph({ data }) {
  const classes = useStyles();
  const svgRef = useRef();
  const wrapperRef = useRef();
  const legendRef = useRef();
  const [selectedDropDownKey, setSelectedDropDownKey] = useState('cases');
  console.log(data);
  const dataStructure = data.date.reduce((acc, date, i) => {
    acc.push({ 
      countryCode: data.countryCode,
      countryName: data.countryName,

      subRegion1: data.subRegion1,
      date: date.slice(5, 10),

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
    const width = 1000;
    const height = 500;
    const margin = { top: 0, right: 0, bottom: 20, left: 0 };


    svg
      .attr('viewBox', `0, 0, ${width}, ${height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    const keys = [
      'newCases',
      'totalCases',
      'newDeaths',
      'totalDeaths',
      'newRecovered',
      'totalRecovered'
    ];

    const colors = {
      'newCases': 'Indigo',
      'totalCases': 'LightSeaGreen',
      'newDeaths': 'Indigo',
      'totalDeaths': 'LightSeaGreen',
      'newRecovered': 'Indigo',
      'totalRecovered': 'LightSeaGreen'
    };
    // stacks / layers
    const stackGenerator = stack()
      .keys(keys.filter(key => key.toLowerCase().includes(selectedDropDownKey)))
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
      .range([margin.left, width - margin.right]) // 0, 10 range of pixels      

      .padding(0.25);
      //scale band given explicit years
    
    const yScale = scaleLinear()
      .domain(extent)
      .range([height - margin.bottom, margin.top]); // 10, 0
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
    const xAxis = axisBottom(xScale)
      .tickValues(xScale.domain().filter((_, i) => i % 14 === 0));

  
    svg
      .select(`.${styles.xAxis}`)
      .style('transform', `translateY(${height - margin.bottom}px)`)
      // .style('fill', 'black')
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg
      .select(`.${styles.yAxis}`)
      // .style('transform', `translateX(${width - margin.right}px)`)
      .call(yAxis);

    const legend = select(legendRef.current)
      .attr('class', `${styles.legendBox}`);

    // const legendText = [`Total ${selectedDropDownKey}`, `New ${selectedDropDownKey}`];
    const legendText = ['Total Cases', 'New Cases'];

    const colorScale = scaleLinear()
      .domain([-100, 100])
      .range(['LightSeaGreen', 'Indigo']);

    const legends = legend.selectAll('span')
      .data([-100, 100]);

    legends.join('span')
      .attr('class', `${styles.legendSpan}`)
      .style('background', (d) => colorScale(d))
      .text(legendText.forEach(number => number))
      .text((d, i) => legendText[i]);

  }), [data, selectedDropDownKey];

  return (   
    <div className={styles.Chart}>
      <div ref={wrapperRef} className={styles.container}>
        <svg className="svg" ref={svgRef}>
          <g className={styles.xAxis} />
          <g className={styles.yAxis} />
        </svg>
      </div>
      <div className={styles.legendBox} ref={legendRef}>
      </div>
      <div className={styles.select}>
        <FormControl variant="filled" className={classes.formControl}>
          <InputLabel id="covid-select-label">Covid Statistics</InputLabel>
          <Select
            labelId="covid-select-label"
            id="covid-select"
            value={selectedDropDownKey}
            onChange={({ target }) => setSelectedDropDownKey(target.value)}
          >
            <MenuItem value="">Choose a Statistic</MenuItem>
            <MenuItem value="cases">Cases</MenuItem>
            <MenuItem value="deaths">Deaths</MenuItem>
            <MenuItem value="recovered">Recovered</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}


StackGraph.propTypes = {
  data: PropTypes.object.isRequired,
};

export default StackGraph;
