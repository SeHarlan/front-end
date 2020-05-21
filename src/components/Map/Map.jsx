import React, { useEffect, useRef, useState } from 'react';
import { select, geoPath, geoMercator, min, max, scaleSequential, interpolateWarm, interpolateRainbow, scaleSqrt, geoOrthographic, scaleLinear } from 'd3';
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

  const geoJson = useWorldMobilityData('2020-04-30T00:00:00.000+00:00');

  useEffect(() => {
    if(!geoJson.features) return;
    const svg = select(svgRef.current);

    const minProp = -100;
    const maxProp = 100;
    const colorScale = scaleLinear().domain([minProp, maxProp]).range(['blue', 'red']);

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

    const projection = geoOrthographic()
      .fitSize([width, height], selectedCountry || geoJson)
      .rotate([rotateX, rotateY, 0])
      .precision(100);
    // const projection = geoMercator()
    //   .fitSize([width, height], selectedCountry || geoJson)
    //   .rotate([rotateX, rotateY, 0])
    //   .precision(100);

    
    const pathGenerator = geoPath().projection(projection);
    

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
