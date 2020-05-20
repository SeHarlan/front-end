import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { select, geoPath, geoMercator, min, max, scaleSequential, interpolateWarm, interpolateRainbow, scaleSqrt, geoOrthographic } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';

import style from './Map.css';

const GeoChart = ({ geoJson, property, rotateX, rotateY }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const svg = select(svgRef.current);

    const minProp = min(geoJson.features, feature => feature.properties[property]);
    const maxProp = max(geoJson.features, feature => feature.properties[property]);
    const colorScale = scaleSqrt().domain([minProp, maxProp]).range(['green', 'red']);
    // const colorScale = scaleSequential().domain([minProp, maxProp]).interpolator(interpolateRainbow);
    // domain([min, middle, max]).range(['red', 'purple', 'blue'])

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
      .on('click', feature => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
        //change a countries position in memory with rotation so zoom will work
      })
      .attr('class', 'country')
      // .transition() //take off while rotating
      .attr('fill', feature => colorScale(feature.properties[property]))
      .attr('d', feature => pathGenerator(feature));

  }, [geoJson, dimensions, property, selectedCountry, rotateX, rotateY]);

  return (
    <div ref={wrapperRef} className={style.Map} >
      <svg ref={svgRef}></svg>
    </div>
  );
};

GeoChart.propTypes = {
  geoJson: PropTypes.array,
  property: PropTypes.string,
  rotateX: PropTypes.number,
  rotateY: PropTypes.number
};

export default GeoChart;
