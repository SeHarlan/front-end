import React, { useEffect, useRef, useState } from 'react';
import { select, geoPath, geoOrthographic, scaleLinear, event, drag, geoMercator } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';
import PropTypes from 'prop-types';

import { Slider, Popover, Typography, Button, makeStyles } from '@material-ui/core'; 

import style from './Map.css';

import { useDispatch, useSelector } from 'react-redux';
import { setGlobalMobilityDataByDate, setSelectedCountryCode } from '../../actions/actions';
import { getMobilityDates, getSelectedCountryCode } from '../../selectors/selectors';
// import { useIsMobile } from '../hooks/isMobile';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'auto',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const Map = ({ mapData, countryCode = '' }) => {
  const [property, setProperty] = useState('residentialChange');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [dateIndex, setDateIndex] = useState(0);
  const [selectedCountryName, setSelectedCountryName] = useState('test'); 

  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const svgRef = useRef();
  const wrapperRef = useRef();
  const legendRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const dispatch = useDispatch();
  // const isMobile = useIsMobile();
  const dates = useSelector(getMobilityDates);
  const selectedCountryCode = useSelector(getSelectedCountryCode);

  //this could be trimed down if we used redux for countryName
  useEffect(() => {
    if(!selectedCountryCode) return;
    const countryData = mapData.features.find(country => country.mobilityData.countryCode === selectedCountryCode).mobilityData;
    setSelectedCountryName(countryData.countryName);
  }, [selectedCountryCode]);

  useEffect(() => {
    if(dates === []) return;
    else dispatch(setGlobalMobilityDataByDate(dates[dateIndex]));
  }, [dateIndex]);
  
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
      .on('click', (country) => {
        dispatch(setSelectedCountryCode(country.mobilityData.countryCode));
        handlePopoverOpen(event);
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

      <Popover id="country-popover" 
        className={classes.popover} 
        classes={{ paper: classes.paper }} 
        open={open} anchorEl={anchorEl} 
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>{selectedCountryName}</Typography>
        <Button variant="contained" color="primary">Details</Button>
        {/* <Button variant="contained" color="secondary" onClick={handlePopoverClose}>X</Button> */}
      </Popover>

      <div ref={legendRef}>Map legend:</div>
      <select value={property} onChange={({ target }) => setProperty(target.value)}>
        <option value="residentialChange">Residential</option>
        <option value="groceryChange">Grocery</option>
        <option value="parksChange">Parks</option>
        <option value="retailChange">Retail</option>
        <option value="transitChange">Transit</option>
        <option value="workplacesChange">Workplace</option>
      </select>
      {dates.length && <Slider 
        value={dateIndex} 
        min={0} 
        max={dates.length - 1} 
        onChange={(_, newValue) => setDateIndex(newValue)} valueLabelDisplay="on" 
        valueLabelFormat={(index) => dates[index].slice(5)} />}
    </div>
  );
};

Map.propTypes = {
  countryCode: PropTypes.string,
  mapData: PropTypes.object.isRequired
};

export default Map;
