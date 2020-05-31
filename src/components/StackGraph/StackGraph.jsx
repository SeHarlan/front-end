import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Chart.css';
import { select, max, scaleLinear, scaleBand, axisBottom, stackOrderAscending, stack, axisLeft, axisRight } from 'd3';
import { Chip, Avatar, Typography, Grid } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useStyles } from './StackGraph.styles';
import { useSelector } from 'react-redux';
import { getSelectedCountryCode, getSelectedSubregion } from '../../selectors/selectors';



function StackGraph({ data }) {
  const classes = useStyles();
  const svgRef = useRef();
  const wrapperRef = useRef();

  const [selectedDropDownKey, setSelectedDropDownKey] = useState('cases');

  const selectedCountryCode = useSelector(getSelectedCountryCode);
  const selectedSubregion = useSelector(getSelectedSubregion);

  const dataStructure = data?.date?.reduce((acc, date, i) => {
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
    if(!dataStructure) return;
    const svg = select(svgRef.current);

    const width = 1000;
    const height = 250;
    const margin = { top: 5, right: 80, bottom: 20, left: 20 };



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
      'newCases': '#2b499d',
      'totalCases': '#229c9a',
      'newDeaths': '#2b499d',
      'totalDeaths': '#229c9a',
      'newRecovered': '#2b499d',
      'totalRecovered': '#229c9a'
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
      .attr('height', sequence => {
        if((yScale(sequence[0]) - yScale(sequence[1]) < 0)) return 0;
        return (yScale(sequence[0]) - yScale(sequence[1]));
      });
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

    const yAxis = axisRight(yScale);
    svg
      .select(`.${styles.yAxis}`)
      .style('transform', `translateX(${width - margin.right}px)`)
      // .attr('transform', 'rotate(90)')
      // .style('text-anchor', 'start')
      .call(yAxis);

  }), [dataStructure, data, selectedDropDownKey, selectedSubregion, selectedCountryCode];

  return (   
    <Grid container className={styles.Chart} alignItems="center" direction="row-reverse" justify="space-between">
      <Grid item xs={12}>
        <div ref={wrapperRef} className={`${styles.container} ${styles.fourToOne}`}>
          <svg className="svg" ref={svgRef}>
            <g className={styles.xAxis} />
            <g className={styles.yAxis} />
          </svg>
        </div>

      </Grid>
      <Grid item xs={10} sm={5} className={classes.legend}>   
        <Chip variant="outlined" style={{ color:'#229c9a', fontWeight: '500', border: '1px solid #229c9a', marginRight: '10px' }} avatar={<Avatar style={{ backgroundColor:'#229c9a' }}> </Avatar>} label={`Total ${selectedDropDownKey}`} />
        <br />
        <Chip variant="outlined" color="primary" avatar={<Avatar> </Avatar>} label={`Daily ${selectedDropDownKey}`} />
      </Grid>
      <Grid item xs={5} className={classes.formContainer}>
        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel id="covid-select-label">Statistics</InputLabel>
          <Select
            label="Statistics"
            labelId="covid-select-label"
            id="covid-select"
            value={selectedDropDownKey}
            onChange={({ target }) => setSelectedDropDownKey(target.value)}
          >
            {/* <MenuItem value="">Choose a Statistic</MenuItem> */}
            <MenuItem value="cases">Cases</MenuItem>
            <MenuItem value="deaths">Deaths</MenuItem>
            <MenuItem value="recovered">Recovered</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      
    </Grid>
  );
}


StackGraph.propTypes = {
  data: PropTypes.object.isRequired,
};

export default StackGraph;
