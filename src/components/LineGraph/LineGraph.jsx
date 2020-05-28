import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Chart.css';
// import styles from '../MiniChart/MiniChart.styles';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, mouse, scaleOrdinal, schemeCategory10, min, max, scaleLog } from 'd3';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Switch, Chip, Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { getSelectedCountryName } from '../../selectors/selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  chipMargin: {
    marginRight: '10px',
  },
}));

function LineGraph({ dataset }) {
  
  const svgRef = useRef();
  const wrapperRef = useRef();
  const classes = useStyles();
  const myColorScale = ['#2b499d', '#229C9A', '#46a1fe'];
  const dailyKeys = ['totalCases', 'totalCurrentCases', 'totalDeaths'];
  const totalKeys = ['newCases', 'newRecovered', 'newDeaths'];
  const [checkedOptions, setCheckedOptions] = useState([]);
  const [switchedToTotal, setSwitchedToTotal] = useState(true);
  const [switchedToLog, setSwitchedToLog] = useState(false);


  const handleTotalSwitch = () => {
    setSwitchedToTotal(!switchedToTotal);
    if(switchedToTotal === true) setCheckedOptions(totalKeys);
    else setCheckedOptions(dailyKeys);
  };
  
  const formattedDate = (badDate) => 
    badDate.toString().slice(6, 7) + '/' + badDate.toString().slice(8, 10);

  const formattedCountryName = (badName) => 
    badName.replace(' ', '_').replace('\'', '');

  const filteredData = (data, selectedKeys) => {
    // Refactor this
    const newArr = [];
    selectedKeys.map(item => { 
      if(data[item]); 
      newArr.push(data[item]);
    });
    return newArr;
  }; 

  // Define initial set of keys to graph based on Switch state
  useEffect(() => {
    setCheckedOptions(switchedToTotal ? dailyKeys : totalKeys);
  }, []);

  // Render the chart
  useEffect(() => {
    if(!dataset || !dataset.date || !checkedOptions) {
      console.log('No data, exiting useEffect()');
      return;
    }

    const svg = select(svgRef.current);

    // Setup variables and viewBox for responsive display
    // const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    // const { width } = dimensions || wrapperRef.current.getBoundingClientRect();
    // const height = width / 2;
    const width = 1000;
    const height = 333;
    // Refactor: Add additional margin style per intended display size of chart
    const margin = { top: 0, right: 100, bottom: 50, left: 10 };

    svg
      .attr('viewBox', `0, 0, ${width}, ${height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    // Define scales
    let yAxisMin = 0;
    let yAxisMax;
    if(switchedToTotal) yAxisMax = max(dataset.totalCases);
    else yAxisMax = max(dataset.newCases);
    if(switchedToLog) {
      if(switchedToTotal) {
        yAxisMin = min(dataset.totalCases);
        yAxisMax = max(dataset.totalCases);
      } else {
        yAxisMin = min(dataset.newCases);
        yAxisMax = max(dataset.newCases);
      }
    }
    const xScale = scaleLinear()
      // This is getting closer, I think? 
      // See https://bl.ocks.org/hitarth19/0295f89b15da5ec03bc1a20644182ce8
      // .domain([min(dataset.date), max(dataset.date)])
      .domain([0, dataset['date'].length - 1]) // range of data
      .range([margin.left, width - margin.right]); // range of pixels
    let yScale;
    if(switchedToLog) {
      yScale = scaleLog()
        .domain([yAxisMin, yAxisMax])
        .range([height - margin.bottom, margin.top]);
    } else {
      yScale = scaleLinear()
        .domain([yAxisMin, yAxisMax])
        .range([height - margin.bottom, margin.top]);
    }
    const colorScale = scaleOrdinal(myColorScale)
      .domain(checkedOptions);
  
    // Define axis
    const xAxis = axisBottom()
      .scale(xScale)
      .ticks(10)
      .tickFormat(index => formattedDate(dataset.date[index]));
    const ticks = switchedToLog ? [5, 'e'] : [height / 40];
    const yAxis = axisRight()
      .scale(yScale)
      .ticks(...ticks)
      // .ticks(Math.floor(maxData / 10), '~s')
      .tickFormat(d => d);

    // Draw axis on pre-existing elements
    svg
      .select(`.${styles.xAxis}`)
      .style('transform', `translateY(${height - margin.bottom}px)`)
      .call(xAxis);
    svg
      .select(`.${styles.yAxis}`)
      .style('transform', `translateX(${width - margin.right}px)`)
      .call(yAxis);

    // Draw background
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
      .data(filteredData(dataset, checkedOptions))
      .join('path')
      .attr('class', 'graphLine')
      .attr('d', value => myLine(value))
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d));

  }, [dataset, checkedOptions, switchedToLog]);

  return (
    <>
      <div className={styles.chartOptionsContainer}>
        <div className={styles.chartOptions}>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={0}>
              <Grid item>Daily</Grid>
              <Grid item>
                <Switch checked={switchedToTotal} onChange={handleTotalSwitch} color="primary" size="small" />
              </Grid>
              <Grid item>Total</Grid>
            </Grid>
          </Typography>

          {/* <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={0}>
              <Grid item>Linear</Grid>
              <Grid item>
                <Switch checked={switchedToLog} onChange={() => setSwitchedToLog(!switchedToLog)} color="primary" size="small" />
              </Grid>
              <Grid item>Logarithmic</Grid>
            </Grid>
          </Typography> */}
        </div>
      </div>  
      
      <div className={styles.Chart}>
        <div ref={wrapperRef} className={`${styles.container} ${styles.threeToOne}`}>
          <svg ref={svgRef}>
            <g className={styles.xAxis} />
            <g className={styles.yAxis} />
            <rect className={styles.chartBackground} />
          </svg>
        </div>
      </div>
      <div>
        {dataset.date &&
         <div className={classes.root}> 
           {/* Refactor: Map through these instead */}
           <Chip variant="outlined" className={classes.chipMargin} style={{ color: `${myColorScale[0]}`, border: `1px solid ${myColorScale[0]}`, backgroundColor: 'white' }} avatar={<Avatar style={{ backgroundColor:`${myColorScale[0]}` }}> </Avatar>} label="Total Cases" />
           <br />
           <Chip variant="outlined" className={classes.chipMargin} style={{ color: `${myColorScale[1]}`, border: `1px solid ${myColorScale[1]}`, backgroundColor: 'white' }} avatar={<Avatar style={{ backgroundColor:`${myColorScale[1]}` }}> </Avatar>} label={switchedToTotal ? 'Current Cases' : 'Recovered Cases'} />
           <br />
           <Chip variant="outlined" className={classes.chipMargin} style={{ color: `${myColorScale[2]}`, border: `1px solid ${myColorScale[2]}`, backgroundColor: 'white' }} avatar={<Avatar style={{ backgroundColor:`${myColorScale[2]}` }}> </Avatar>} label="Deaths" />
           <br />
         </div>
        }
      </div>
    </>
  );
}

LineGraph.propTypes = {
  dataset: PropTypes.object.isRequired,
};


export default LineGraph;
