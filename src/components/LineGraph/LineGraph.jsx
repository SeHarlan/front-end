import React, { useRef, useEffect, useState } from 'react';
import styles from './LineGraph.css';
// import JSONdata from '../../data/daily-test.json';
import * as d3 from 'd3';
import { select, line, curveCardinal, axisBottom, axisRight, scaleLinear, mouse, bisector, event } from 'd3';
import { useCovidData } from '../../hooks/covidHooks';
import { useMobilityDataByDate } from '../../hooks/mobilityHooks';
import { useResizeObserver } from '../../hooks/d3Hooks';


function LineGraph() {
  
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const [property, setProperty] = useState('positive');
  const { dateData, positiveData, recoveredData, deathData } = useCovidData();
  const covidData = { date: dateData, positive: positiveData, recovered: recoveredData, death: deathData };
  // const mobilityData = useMobilityDataByDate('2020-04-30T00:00:00.000+00:00');
  const [checkedOptionsArray, setCheckedOptionsArray] = useState(['positive']);

  const handleCheckbox = ({ target }) => {
    if(!checkedOptionsArray.includes(target.value)) 
      setCheckedOptionsArray(prevState => [...prevState, target.value]);
    else setCheckedOptionsArray(checkedOptionsArray.filter(item => (item !== target.value)));
  };
  
  const checkboxOptions = (data) => {
    const myKeys = filteredKeys(data);
    return myKeys.map((myKey, i) => 
      <div key={i}>
        <input type='checkbox' 
          id={myKey} 
          name={myKey} 
          value={myKey} 
          onChange={handleCheckbox} 
          checked={checkedOptionsArray.includes(myKey)} />
        <label htmlFor={myKey}>{myKey}</label>
      </div>
    );
  };
  
  function formatDate(badDate) {
    return badDate.toString().slice(5, 6) + '/' + badDate.toString().slice(6);
  }
  
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
    return keys.filter(item => item !== 'date');
  };
  

  useEffect(() => {
    if(!dimensions) return;
    if(!dateData || !positiveData || !recoveredData || !deathData) return;

    const svg = select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    // Define scaling
    const xScale = scaleLinear()
      .domain([0, covidData['positive'].length - 1])
      .range([width, 0]);
    const yScale = scaleLinear()
      .domain([0, Math.max(...covidData['positive'])])
      .range([height, 0]);
  
    // Define axis labels
    const xAxis = axisBottom(xScale)
      .ticks(covidData[property].length / 5)
      .tickFormat(index => formatDate(dateData[index]));
    const yAxis = axisRight(yScale)
      .ticks(covidData[property].length / 5);

    // Add axis
    svg
      .select('.x-axis')
      .style('transform', `translateY(${height}px)`)
      .call(xAxis);
    svg
      .select('.y-axis')
      .style('transform', `translateX(${width}px)`)
      .call(yAxis);
    
    // Define line values
    const myLine = line()
      .x((value, index) => xScale(index))
      .y((yScale))
      .curve(curveCardinal);
   
    // Add line
    svg
      .selectAll('.graphLine')
      .data(filteredData(covidData, checkedOptionsArray))
      .join('path')
      .attr('class', 'graphLine')
      .attr('d', value => myLine(value))
      .attr('fill', 'none')
      .attr('stroke', 'blue');


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


  }, [covidData, checkedOptionsArray]);

  return (   
    <div className={styles.LineGraph}>
      <div ref={wrapperRef} className={styles.container}>
        <svg ref={svgRef}>
          <g className='x-axis' />
          <g className='y-axis' />
        </svg>
        {/* <select value={property} onChange={({ target }) => setProperty(target.value)}>
          {selectOptions(covidData)} */}
        {/* <option value='positive'>Total Positive Cases</option>
          <option value='recovered'>Current Cases</option>
          <option value='death'>Deaths</option> */}
        {/* </select> */}
      </div>
      <div className={styles.Controls}>
        {checkboxOptions(covidData)}
      </div>

    </div>
  );
}

export default LineGraph;
