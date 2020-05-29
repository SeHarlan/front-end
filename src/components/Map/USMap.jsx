import React, { useEffect, useRef, useState } from 'react';
import { select, geoPath, geoOrthographic, scaleLinear, event, drag, geoMercator, geoAlbersUsa } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';
import PropTypes from 'prop-types';

import { Slider, Popover, Typography, Button, withStyles, FormControl, InputLabel, Select, MenuItem, Paper, Grid, FormLabel, RadioGroup, FormControlLabel, Radio, CircularProgress } from '@material-ui/core'; 

import style from './Map.css';

import { useDispatch, useSelector } from 'react-redux';
import { setGlobalMobilityDataByDate, setSelectedCountry, setUSMobilityDataByDate, setSelectedSubregion, resetCovidSubData, setMobilitySubData, resetMobilitySubData } from '../../actions/actions';
import { getMobilityDates, getSelectedCountryCode, getSelectedCountryName, getSelectedSubregion } from '../../selectors/selectors';
import { useHistory } from 'react-router-dom';
import { useStyles } from './Map.styles';
import { useIsMobile, useScreenDimensions } from '../../hooks/isMobile';

const SliderStyled = withStyles({
  root: {
    height: 8
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -6,
    marginLeft: -12
  },
  active: {},
  valueLabel: {
    left: 'calc(-50%)'
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4,
    width: '100.5%'
  },
  mark: {
    height: 8,
    width: 2,
    marginTop: 0
  },
})(Slider);

const Map = ({ mapData, selectedSubregion }) => {
  const dates = useSelector(getMobilityDates);
  // const selectedCountryCode =  useSelector(getSelectedCountryCode);
  // const selectedCountryName = useSelector(getSelectedCountryName);

  const [property, setProperty] = useState('retailChange');
  const [clicked, setClicked] = useState(false);
  const [dateIndex, setDateIndex] = useState(48); //hard coded index for now, would come from dates.length - 1
  const [selectedState, setSelectedState] = useState(null);
  const isMobile = useIsMobile();
  const { width: screenWidth } = useScreenDimensions();

  const classes = useStyles();

  const marks = (!isMobile) 
    ? [
      { value: 0, label: dates[0]?.slice(5).replace('-', '/') },
      { value: 16, label: dates[16]?.slice(5).replace('-', '/') },
      { value: 32, label: dates[32]?.slice(5).replace('-', '/') },
      { value: 48, label: dates[48]?.slice(5).replace('-', '/') },
      { value: 64, label: dates[64]?.slice(5).replace('-', '/') },
      { value: 80, label: dates[80]?.slice(5).replace('-', '/') },
      { value: 96, label: dates[96]?.slice(5).replace('-', '/') },
    ]
    : [
      { value: 0, label: dates[0]?.slice(5).replace('-', '/') },
      { value: 48, label: dates[48]?.slice(5).replace('-', '/') },
      { value: 96, label: dates[96]?.slice(5).replace('-', '/') },
    ];

  const svgRef = useRef();
  const wrapperRef = useRef();
  const legendRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!dates.length) return;
    else dispatch(setUSMobilityDataByDate(dates[dateIndex]));
  }, [dateIndex]);

  useEffect(() => {
    if(!selectedSubregion.length) return;
    const newState = mapData.features.find(state => state.properties.NAME === selectedSubregion);
    setSelectedState(newState);
  }, [selectedSubregion]);
  
  useEffect(() => {
    if(!mapData.features) return;

    const svg = select(svgRef.current);

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const colorScale = scaleLinear()
      .domain([-100, 0, 100])
      .range(['#B71C1C', 'rgb(243, 240, 225)', '#1d7d0a']);    

    const flatProjection = geoAlbersUsa()
      .fitSize([width, height], selectedState || mapData)
      .precision(100);

    const pathGenerator = geoPath().projection(flatProjection); 

    svg
      .selectAll('.state')
      .data(mapData.features)
      .join('path')
      .on('click', (state) => {
        setClicked(true);
        if(selectedState === state) {
          setSelectedState(null);
          dispatch(setSelectedSubregion(''));
        } else {
          setSelectedState(state);
          dispatch(setSelectedSubregion(state.properties.NAME));
        }
      })
      .attr('class', 'state')
      .transition()
      .attr('fill', state => state?.mobilityData[property] 
        ? colorScale(state?.mobilityData[property])
        : '#dfe2e8'
      )
      .attr('d', state => pathGenerator(state));
  
    
    const legend = select(legendRef.current);
    const legendText = [100, 75, 50, 25, 0, -25, -50, -75, -100];
    legend.selectAll('span')
      .data(legendText)
      .join('span')     
      .attr('class', style.mapLegend)
      .style('background', (d) => colorScale(d))
      .text((d, i) => legendText[i]);
      
  }, [mapData, dimensions, property, selectedState]);

  return (<>
    <Grid container className={classes.mapContainer} alignItems="center" justify="center" spacing={2}>

      <Grid item xs={3} sm={2} >
        <Paper elevation={2} className={classes.legendPaper}>
          {(screenWidth > 600) && <p>Percent increase or decrease in travel to <b>{property.replace('sChange', '').replace('Change', '')}</b> locations</p>}
          <div ref={legendRef} className={style.mapLegendContainer}></div>
          <p className={style.legendNoData}>{(screenWidth < 600) ? 'N/A' : 'No Data Available'}</p>
          {(screenWidth > 600) && <em className={classes.aside}>*compared to baseline, pre-pandemic measurements</em>}
        </Paper>
      </Grid>
    
      <Grid item xs={9} sm={8}ref={wrapperRef} className={style.Map} >
        { !mapData.features 
          ? <CircularProgress /> 
          : (<> 
            {!clicked && <Typography variant="body1" className={classes.dragLabel}>Click to zoom / zoom out</Typography>}
            <svg ref={svgRef} className={`${style.svgStyle} ${style.US}`}></svg>
          </>)
        }
      </Grid>
      
      <Grid item xs={12} sm={2}>
        <Paper elivation={2} className={classes.legendPaper}>
          <FormControl component="fieldset">

            {/* <FormLabel component="legend">Choose a Metric</FormLabel> */}
            <RadioGroup row={isMobile || screenWidth < 600} aria-label="position" name="metric" defaultValue="retailChange" onChange={({ target }) => setProperty(target.value)}>

              <FormControlLabel
                value="groceryChange"
                control={<Radio color="primary"/>}
                label="Grocery"
              />
              <FormControlLabel
                value="parksChange"
                control={<Radio color="primary"/>}
                label="Parks"
              />
              <FormControlLabel
                value="retailChange"
                control={<Radio color="primary"/>}
                label="Retail"
              />
              <FormControlLabel
                value="transitChange"

                control={<Radio color="primary"/>}
                label="Transit"
              />
              <FormControlLabel
                value="workplacesChange"
                control={<Radio color="primary"/>}
                label="Workplace"
              />
            </RadioGroup>
          </FormControl>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        {dates.length && <SliderStyled 
          value={dateIndex} 
          min={0} 
          max={dates.length - 1} 
          onChange={(_, newValue) => setDateIndex(newValue)} valueLabelDisplay="on" 
          valueLabelFormat={(index) => dates[index].slice(5)}
          marks={marks} />}
      </Grid>
    </Grid>
  </>  
  );
};

Map.propTypes = {
  mapData: PropTypes.object.isRequired,
  selectedSubregion: PropTypes.string.isRequired
};

export default Map;
