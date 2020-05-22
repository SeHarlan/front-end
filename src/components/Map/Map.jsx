import React, { useEffect, useRef, useState } from 'react';
import { select, geoPath, geoMercator, min, max, scaleSequential, interpolateWarm, interpolateRainbow, scaleSqrt, geoOrthographic, scaleLinear, geoGraticule, event, mouse, drag } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';
import { Grid, Typography } from '@material-ui/core';

import style from './Map.css';
import { useWorldMobilityData } from '../../hooks/mobilityHooks';

const WorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [property, setProperty] = useState('residentialChange');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const geoJson = useWorldMobilityData('2020-05-01T00:00:00.000+00:00');

  const svgRef = useRef();
  const wrapperRef = useRef();

  const dimensions = useResizeObserver(wrapperRef);
  
  useEffect(() => {
    if(!geoJson.features) return;

    const svg = select(svgRef.current);

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const colorScale = scaleLinear()
      .domain([-100, 0, 100])
      .range(['blue', 'rgb(243, 240, 225)', 'green']);

    const projection = geoOrthographic()
      .fitSize([width * 0.9, height * 0.9], geoJson)
      .center([0, 0])
      .rotate([rotateX, rotateY, 0])
      .translate([width / 2, height / 2])
      .precision(200);

    const pathGenerator = geoPath().projection(projection);

    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient')
      .attr('x1', '60%')
      .attr('y1', '30%')
      .attr('x2', '20%')
      .attr('y2', '90%');
    linearGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgb(152, 233, 225)');
    linearGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgb(49, 167, 187)');

    svg
      .selectAll('circle')
      .data(['spot'])
      .join('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale())
      .style('fill', 'url(#linear-gradient)');

    svg.call(drag()
      .on('drag', function() {
        const rotate = projection.rotate();
        const k = 50 / projection.scale();
        projection.rotate([
          rotate[0] + event.dx * k, 
          rotate[1] - event.dy * k
        ]);
        setRotateX(rotate[0] + event.dx * k);
        setRotateY(rotate[1] - event.dy * k);
      })
    );

    svg
      .selectAll('.country')
      .data(geoJson.features)
      .join('path')
      .on('click', clickedCountry => {
        // setSelectedCountry(selectedCountry === clickedCountry ? null : clickedCountry);
        //change a countries position in memory with rotation so zoom will work
      })
      .attr('class', 'country')
      // .transition() //take off while rotating
      .attr('fill', country => country.mobilityData[property] 
        ? colorScale(country.mobilityData[property])
        : 'rgba(150, 150, 150, 0.3)'
      )
      .attr('d', country => pathGenerator(country));
      
  }, [geoJson, dimensions, property, selectedCountry, rotateY, rotateX]);

  return (
    <div ref={wrapperRef} className={style.Map} >
      <svg ref={svgRef}></svg>
      <select value={property} onChange={({ target }) => setProperty(target.value)}>
        <option value="residentialChange">Residential</option>
        <option value="groceryChange">Grocery</option>
        <option value="parksChange">Parks</option>
        <option value="retailChange">Retail</option>
        <option value="transitChange">Transit</option>
        <option value="workplacesChange">Workplace</option>
      </select>
    </div>
  );
};

export default WorldMap;
