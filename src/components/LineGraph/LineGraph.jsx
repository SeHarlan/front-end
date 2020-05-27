import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Chart.css';
// import styles from '../MiniChart/MiniChart.styles';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, mouse, scaleOrdinal, schemeCategory10, min, max, scaleLog } from 'd3';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { useResizeObserver } from '../../hooks/d3Hooks';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Switch, Chip, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

function LineGraph({ dataset }) {
  
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [checkedOptions, setCheckedOptions] = useState(['totalCases', 'totalDeaths']);
  const classes = useStyles();
  const [switchedToTotal, setSwitchedToTotal] = useState(true);
  const [switchedToLog, setSwitchedToLog] = useState(false);

  const handleCheckbox = ({ target }) => {
    if(!checkedOptions.includes(target.value)) 
      setCheckedOptions(prevState => [...prevState, target.value]);
    else setCheckedOptions(checkedOptions.filter(item => (item !== target.value)));
  };

  const handleTotalSwitch = () => {
    setSwitchedToTotal(!switchedToTotal);
    if(switchedToTotal === true) 
      setCheckedOptions(['newCases', 'newDeaths']);
    else setCheckedOptions(['totalCases', 'totalDeaths']);
  };

  const checkboxOptions = (data) => {
    const myKeys = filteredKeys(data);
    return myKeys.map((myKey, i) => 
      <FormControlLabel 
        key={i} 
        control={
          <Checkbox 
            checked={checkedOptions.includes(myKey)} 
            onChange={handleCheckbox}
            id={myKey} 
            name={myKey} 
            value={myKey}
          />}
        label={myKey} />
    );
  };
  
  const formattedDate = (badDate) => 
    badDate.toString().slice(6, 7) + '/' + badDate.toString().slice(8, 10);

  const formattedCountryName = (badName) => 
    badName.replace(' ', '_').replace('\'', '');

  const selectOptions = (data) => {
    const myKeys = filteredKeys(data);
    return myKeys.map((myKey, i) => <option key={i} value={myKey}>{myKey}</option>);
  };

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


  // useEffect(() => {
  //   console.log('filtered keys: ', filteredKeys(dataset));
  //   setCheckedOptions(filteredKeys(dataset));
  // }, [dataset]);

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
    const width = 1000;
    const height = 333;
    // Refactor: Add additional margin style per intended display size of chart
    const margin = { top: 0, right: 100, bottom: 50, left: 10 };

    svg
      .attr('viewBox', `0, 0, ${width}, ${height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    // Define scales
    const yAxisMin = min(dataset.totalCases ?? -100);
    const yAxisMax = max(dataset.totalCases ?? 100);

    const xScale = scaleLinear()
      .domain([0, dataset['date'].length - 1]) // range of data
      .range([margin.left, width - margin.right]); // range of pixels
    let yScale = scaleLinear()
      .domain([yAxisMin, yAxisMax])
      .range([height - margin.bottom, margin.top]);
    if(switchedToLog) {
      yScale = scaleLog()
        .domain([yAxisMin, yAxisMax])
        .range([height - margin.bottom, margin.top]);
    }
    const colorScale = scaleOrdinal(['#FF8C00', '#8B0000'])
      .domain(filteredKeys(dataset));
  
    // Define axis
    const xAxis = axisBottom()
      .scale(xScale)
      .ticks(dataset['date'].length / 5)
      .tickFormat(index => formattedDate(dataset.date[index]));
    const yAxis = axisRight()
      .scale(yScale)
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

    function justHereToFoldBadMouseoverCode() {
    // // Mouseover bubbles
    // const mouseG = svg.append('g')
    //   .attr('class', 'mouse-over-effects');
    // const lines = document.getElementsByClassName('graphLine');
    // console.log('lines:', lines);
    // const mousePerLine = mouseG.selectAll('.mouse-per-line')
    //   .data(filteredData(covidData, checkedOptionsArray))
    //   .enter()
    //   .append('g')
    //   .attr('class', 'mouse-per-line');
    // mousePerLine.append('circle')
    //   .attr('r', 4)
    //   .style('stroke', 'red')
    //   .style('fill', 'none')
    //   .style('stroke-width', '1px')
    //   .style('opacity', '0');
    // mousePerLine.append('text')
    //   .attr('transform', 'translate(10,3)');
    // mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    //   .attr('width', width) // can't catch mouse events on a g element
    //   .attr('height', height)
    //   .attr('fill', 'none')
    //   .attr('pointer-events', 'all');

      // // on mouse out hide line, circles and text
      // mouseG.on('mouseout', function() { 
      //   svg.selectAll('.mouse-per-line circle').style('opacity', '0');
      //   svg.selectAll('.mouse-per-line text').style('opacity', '0');
      // });

      // // on mouse in show line, circles and text
      // mouseG.on('mouseover', function() { 
      //   svg.selectAll('.mouse-per-line circle').style('opacity', '1');
      //   svg.selectAll('.mouse-per-line text').style('opacity', '1');
      // });

      // // mouse moving over canvas
      // mouseG.on('mousemove', function() {
      //   const thisMouse = mouse(this);
      //   svg
      //     .selectAll('.mouse-per-line')
      //     .attr('transform', function(d, i) {
      //       const offsetLeft = wrapperRef.current.offsetLeft;
      //       const offsetTop = wrapperRef.current.offsetTop;
      //       let x = event.pageX - offsetLeft;
      //       let y = event.pageY - offsetTop;
      //       let beginning = x;
      //       let pathLength = lines[i].getTotalLength();
      //       let end = pathLength;
      //       let target;
      //       let pos;
      //       while(true) {
      //         target = Math.floor((beginning + end) / 2);
      //         pos = lines[i].getPointAtLength(target);
      //         console.log('pos:', pos);
      //         if((target === end || target === beginning) && pos.x !== x) {
      //           break;
      //         }
      //         if(pos.x > x) end = target;
      //         else if(pos.x < x) beginning = target;
      //         else break; //position found
      //       }
          
      //       // var xDate = xScale.invert(mouse[0]),
      //       // bisect = bisector(function(d) { return d.date; }).right;
      //       // let idx = bisect(d.values, xDate);
      //       // console.log('idx', idx);

      //       d3.select(this)
      //         .select('text')
      //         .text(yScale.invert(y).toFixed(0));

      //       // console.log('===');
      //       // console.log('width and height', width, height);
      //       // console.log('x is', x);
      //       // console.log('pos.x is', pos.x);
      //       // console.log('thisMouse[0] is', thisMouse[0]);
      //       // console.log('x scaled is', xScale(x));
      //       // console.log('x inverse is', xScale.invert(x));
      //       // console.log('pos.x inverse is', xScale.invert(pos.x));
      //       // console.log('---');
      //       // console.log('y is', y);
      //       // console.log('pos.y is', pos.y);
      //       // console.log('thisMouse[1] is', thisMouse[1]);
      //       // console.log('y inverse is', yScale.invert(y));
      //       // console.log('pos.y inverse is', yScale.invert(pos.y));

    //       return 'translate(' + x + ',' + pos.y + ')';
    //     });
    // });
    }
  }, [dataset, checkedOptions, switchedToLog]);

  return (
    <>
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

        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={0}>
            <Grid item>Linear</Grid>
            <Grid item>
              <Switch checked={switchedToLog} onChange={() => setSwitchedToLog(!switchedToLog)} color="secondary" size="small" />
            </Grid>
            <Grid item>Logarithmic</Grid>
          </Grid>
        </Typography>
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
           <Chip variant="outlined" style={{ color:'darkorange', border: '1px solid darkorange' }} avatar={<Avatar style={{ backgroundColor:'darkorange' }}> </Avatar>} label="Positive Cases" />
           <br />
           <Chip variant="outlined" color="primary" avatar={<Avatar> </Avatar>} label="Deaths" />
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
