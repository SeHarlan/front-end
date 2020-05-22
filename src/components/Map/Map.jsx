import React, { useEffect, useRef, useState } from 'react';
import { select, geoPath, geoMercator, min, max, scaleSequential, interpolateWarm, interpolateRainbow, scaleSqrt, geoOrthographic, scaleLinear, geoGraticule, event, mouse, drag } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';

import style from './Map.css';
import { useWorldMobilityData } from '../../hooks/mobilityHooks';

const GeoChart = () => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [property, setProperty] = useState('residentialChange');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [deltaX, setDeltaX] = useState(null);
  const [deltaY, setDeltaY] = useState(null);
  // const [rotate, setRotate] = useState([0, 0, 0]);

  const geoJson = useWorldMobilityData('2020-05-01T00:00:00.000+00:00');

  // code for mouse coordinates modified from http://bl.ocks.org/1392560
  // let mouseStart, rotationStart;
  // function mousedown() {
  //   // mouseStart = [event.pageX, event.pageY];
  //   mouseStart = mouse(svgRef);
  //   rotationStart = rotate;
  //   // event.preventDefault();
  // }

  // function mousemove() {
  //   if(mouseStart) {
  //     // const mouseEnd = [event.pageX, event.pageY];
  //     const mouseEnd = mouse(svgRef);
  // const rotationEnd = [rotationStart[0] + (mouseEnd[0] - mouseStart[0]) / 6, rotationStart[1] + (mouseStart[1] - mouseEnd[1]) / 6];
  // rotationEnd[1] = rotationEnd[1] > 30  ? 30  :
  //   rotationEnd[1] < -30 ? -30 :
  //     rotationEnd[1];
  // setRotate(rotationEnd);
  //   }
  // }
  // function mouseup() {
  //   if(mouseStart) {
  //     mousemove();
  //     mouseStart = null;
  //   }
  // }

  // select(window)
  //   .on('mousemove', mousemove)
  //   .on('mouseup', mouseup);

  const dragHandler = drag()
    .on('start', function() {
      // let current = select(svgRef.current);
      setDeltaX(rotateX - event.x);
      setDeltaY(rotateY - event.y);
    })
    .on('drag', function() {
      setRotateX((event.x + deltaX) / 6);
      setRotateY((event.y + deltaY) / -6);
      console.log('deltaX', deltaX);
      console.log('deltaY', deltaY);
    })
    .on('end', function() {
      setDeltaX(rotateX);
      setDeltaY(rotateY);
    });

  useEffect(() => {
    if(!geoJson.features) return;
    const svg = select(svgRef.current);

    const minProp = -100;
    const maxProp = 100;
    const colorScale = scaleLinear().domain([minProp, 0, maxProp]).range(['blue', 'rgb(243, 240, 225)', 'green']);

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

    const projection = geoOrthographic()
      .fitSize([width, height], selectedCountry || geoJson)
      .rotate([rotateX, rotateY, 0])
      .precision(100);
    // const projection = geoMercator()
    //   .fitSize([width, height], selectedCountry || geoJson)
    //   .rotate([rotateX, rotateY, 0])
    //   .precision(100);

    // const graticule = geoGraticule();

    const pathGenerator = geoPath().projection(projection);

    // svg
    //   .selectAll('path.graticule')
    //   .data([graticule()])
    //   .join('path')
    //   .attr('class', 'graticule')
    //   .attr('d', line => pathGenerator(line));

    svg
      .selectAll('circle')
      .data(['spot'])
      .enter()
      .append('circle')
      .data([1])
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale())
      .style('fill', 'turquoise');
  
    svg
      .selectAll('.country')
      .data(geoJson.features)
      .join('path')
      .on('click', clickedCountry => {
        setSelectedCountry(selectedCountry === clickedCountry ? null : clickedCountry);
        //change a countries position in memory with rotation so zoom will work
      })
      .attr('class', 'country')
      // .transition() //take off while rotating
      .attr('fill', country => country.mobilityData[property] 
        ? colorScale(country.mobilityData[property])
        : 'grey'
      )
      .attr('d', country => pathGenerator(country));
      
    dragHandler(svg);
      
  }, [geoJson, dimensions, property, selectedCountry, rotateX, rotateY]);

  return (
    <div ref={wrapperRef} className={style.Map} >
      <svg ref={svgRef}></svg>
      <select value={property} onChange={({ target }) => setProperty(target.value)}>
        <option value="residentialChange">Residential</option>
        <option value="groceryChange">Grocery</option>
        <option value="parksChange">Parks</option>
        <option value="retailChange">Retail</option>
        <option value="transitChange">Transit</option>
        <option value="workplaceChange">Workplace</option>
      </select>
      <span>rotate X</span>
      <input type="range" min="-180" max="180" step="0.5" value={rotateX} onChange={({ target }) => setRotateX(target.value)}/>
      <span>rotate Y</span>
      <input type="range" min="-180" max="180" step="0.5" value={rotateY} onChange={({ target }) => setRotateY(target.value)}/>
    </div>
  );
};

export default GeoChart;
