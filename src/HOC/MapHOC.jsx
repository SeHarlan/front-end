import React, { useEffect, useRef, useState } from 'react';
import { select, geoPath, geoOrthographic, scaleLinear, event, drag, geoMercator } from 'd3';
import { useResizeObserver } from '../hooks/d3Hooks';
import PropTypes from 'prop-types';

import style from './MapHOC.css';
// import { useIsMobile } from '../hooks/isMobile';

const Map = ({ mapData, countryCode = '' }) => {
  const [property, setProperty] = useState('residentialChange');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotating, setRotating] = useState(false);

  const svgRef = useRef();
  const wrapperRef = useRef();
  const legendRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  // const isMobile = useIsMobile();
  
  useEffect(() => {
    if(!mapData.features) return;

    const svg = select(svgRef.current);

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const colorScale = scaleLinear()
      .domain([-100, 0, 100])
      .range(['blue', 'rgb(243, 240, 225)', 'green']);

    //globe Projection
    const projection = geoOrthographic()
      .fitSize([width * 0.9, height * 0.9], mapData)
      .center([0, 0])
      .rotate([rotateX, rotateY, 0])
      .translate([width / 2, height / 2])
      .precision(100);

    

    const selectedCountry = mapData.features
      .find(({ properties }) => properties.iso_a2 === countryCode);
    //Country Projection
    const flatProjection = geoMercator()
      .fitSize([width, height], selectedCountry)
      .precision(50);

    const pathGenerator = countryCode ? geoPath().projection(flatProjection) : geoPath().projection(projection);

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

    if(!countryCode) svg
      .selectAll('circle')
      .data(['spot'])
      .join('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', projection.scale())
      .style('fill', 'url(#linear-gradient)');

    
    svg.call(drag()
      .on('start', () => { setRotating(true);})
      .on('drag', () => {

        const rotate = projection.rotate();
        const sensitivity = 50 / projection.scale();

        projection.rotate([
          rotate[0] + event.dx * sensitivity, 
          rotate[1] - event.dy * sensitivity,
        ]);
        setRotateX(rotate[0] + event.dx * sensitivity);
        setRotateY(rotate[1] - event.dy * sensitivity);

        const path = geoPath().projection(projection);
        svg.selectAll('path').attr('d', path);
      })
      .on('end', () => { setRotating(false);})
      
    );

    const map = svg
      .selectAll('.country')
      .data(mapData.features)
      .join('path')
      .on('click', clickedCountry => {
        //code for when a country is clicked
      })
      .attr('class', 'country');
    
    if(rotating) {
      map
        .attr('fill', country => country.mobilityData[property] 
          ? colorScale(country.mobilityData[property])
          : 'rgba(150, 150, 150, 0.3)'
        )
        .attr('d', country => pathGenerator(country));  
    } else {
      map
        .transition()
        .attr('fill', country => country.mobilityData[property] 
          ? colorScale(country.mobilityData[property])
          : 'rgba(150, 150, 150, 0.3)'
        )
        .attr('d', country => pathGenerator(country));
    }
    
    const legend = select(legendRef.current)
      .attr('class', 'legendColor');

    const legendText = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

    const keys = legend.selectAll('span')
      .data([-100, -75, -50, -25, 0, 25, 50, 75, 100]);

    keys.join('span')
      .attr('class', 'legendSpan')
      .style('background', (d) => colorScale(d))
    // .text(legendText.forEach(number => number));
      .text((d, i) => legendText[i]);
      
  }, [mapData, dimensions, property]);


  return (
    <div ref={wrapperRef} className={style.Map} >
      <svg ref={svgRef}></svg>
      <div ref={legendRef}>Map legend:</div>
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

Map.propTypes = {
  countryCode: PropTypes.string,
  mapData: PropTypes.object.isRequired
};

export default Map;
