import React, { useEffect, useRef, useState } from 'react';
import { select, geoPath, geoOrthographic, scaleLinear, event, drag, geoMercator } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';
import PropTypes from 'prop-types';

import { Slider, Popover, Typography, Button, withStyles, FormControl, InputLabel, Select, MenuItem, Paper, Grid, FormLabel, RadioGroup, FormControlLabel, Radio, CircularProgress } from '@material-ui/core'; 

import style from './Map.css';

import { useDispatch, useSelector } from 'react-redux';
import { setGlobalMobilityDataByDate, setSelectedCountryCode, setSelectedCountry } from '../../actions/actions';
import { getMobilityDates, getSelectedCountryCode, getSelectedCountryName } from '../../selectors/selectors';
import { useHistory } from 'react-router-dom';
import { useStyles } from './Map.styles';
import { useIsMobile } from '../../hooks/isMobile';

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

const Map = ({ mapData, countryCode = '' }) => {
  const dates = useSelector(getMobilityDates);
  const selectedCountryCode =  useSelector(getSelectedCountryCode);

  const [property, setProperty] = useState('retailChange');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [dateIndex, setDateIndex] = useState(84); //hard coded index for now, would come from dates.length - 1
  const [selectedCountryData, setSelectedCountryData] = useState({});
  const selectedCountryName = useSelector(getSelectedCountryName);

  const classes = useStyles();

  //use increments of 21 for more even markers
  const marks = [
    { value: 0, label: dates[0]?.slice(5) },
    { value: 15, label: dates[15]?.slice(5) },
    { value: 29, label: dates[29]?.slice(5) },
    { value: 46, label: dates[46]?.slice(5) },
    { value: 60, label: dates[60]?.slice(5) },
    { value: 76, label: dates[76]?.slice(5) },
    { value: 84, label: dates[84]?.slice(5) },
  ];

  //PopOver
  const [anchorEl, setAnchorEl] = useState(null);
  // const handlePopoverOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  //PopOver

  const svgRef = useRef();
  const wrapperRef = useRef();
  const legendRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const wrapperHeight = dimensions?.height;
  const dispatch = useDispatch();
  const history = useHistory();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if(!selectedCountryCode) return setAnchorEl(null);
    setAnchorEl(wrapperRef.current);
  }, [selectedCountryCode]);

  useEffect(() => {
    if(!dates.length) return;
    else dispatch(setGlobalMobilityDataByDate(dates[dateIndex]));
  }, [dateIndex]);
  
  useEffect(() => {
    if(!mapData.features) return;

    const svg = select(svgRef.current);

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const colorScale = scaleLinear()
      .domain([-100, 0, 100])
      .range(['#B71C1C', 'rgb(243, 240, 225)', '#1d7d0a']);

    const globePosition = [width / 2, height / 2];
    const globeScale = 1;
    //globe Projection
    const projection = geoOrthographic()
      .fitSize([width * globeScale, height * globeScale], mapData)
      .center([0, 0])
      .rotate([rotateX, rotateY, 0])
      .translate(globePosition)
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
      .attr('stop-color', '#2493C3');
    linearGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2C4099');

    const drop_shadow = svg.append('defs').append('radialGradient')
      .attr('id', 'drop_shadow')
      .attr('cx', '50%')
      .attr('cy', '50%');
    drop_shadow.append('stop')
      .attr('offset', '20%').attr('stop-color', '#000')
      .attr('stop-opacity', '.5');
    drop_shadow.append('stop')
      .attr('offset', '100%').attr('stop-color', '#000')
      .attr('stop-opacity', '0');  

    if(!countryCode) svg
      .selectAll('ellipse')
      .data(['spot'])
      .join('ellipse')
      .attr('cx', globePosition[0] - (width / 20))
      .attr('cy', globePosition[1] + (height / 2.06))
      .attr('rx', projection.scale() * 1.1)
      .attr('ry', projection.scale() * .25)
      .attr('class', 'noclicks')
      .style('fill', 'url(#drop_shadow)');

    if(!countryCode) svg
      .selectAll('circle')
      .data(['spot'])
      .join('circle')
      .attr('cx', globePosition[0])
      .attr('cy', globePosition[1])
      .attr('r', projection.scale())
      .style('fill', 'url(#linear-gradient)');


    
    if(!countryCode) svg.call(drag()
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
        const { countryCode, countryName } = country.mobilityData;
        if(!countryCode || !countryName) return;
        dispatch(setSelectedCountry({ countryCode, countryName }));
        setSelectedCountryData(country.mobilityData);
      })
      .attr('class', 'country')
      .classed(style.noData, function(d) {
        return !d.mobilityData[property];
      });
    
    if(rotating) {
      map
        .attr('fill', country => country.mobilityData[property] 
          ? colorScale(country.mobilityData[property])
          : '#dfe2e8'
        )
        .attr('d', country => pathGenerator(country));  
    } else {
      map
        .transition()
        .attr('fill', country => country.mobilityData[property] 
          ? colorScale(country.mobilityData[property])
          : '#dfe2e8'
        )
        .attr('d', country => pathGenerator(country));
    }
    
    const legend = select(legendRef.current);
    const legendText = [100, 75, 50, 25, 0, -25, -50, -75, -100];
    legend.selectAll('span')
      .data(legendText)
      .join('span')     
      .attr('class', style.mapLegend)
      .style('background', (d) => colorScale(d))
      .text((d, i) => legendText[i]);
      
  }, [mapData, dimensions, property]);

  return (<>
    <Grid container className={classes.mapContainer} alignItems="center" justify="center" spacing={2}>

      <Grid item xs={3} sm={2} >
        <Paper elevation={2} className={classes.legendPaper}>
          <div ref={legendRef} 
            className={style.mapLegendContainer}
          >% increase in travel to {property.replace('Change', '')} locations 
          </div>
          <p className={style.legendNoData}>No Data Available</p>
          <div>% decrease in travel to {property.replace('Change', '')} locations</div>
        </Paper>
      </Grid>
    
      <Grid item xs={9} sm={8}ref={wrapperRef} className={style.Map} >
        { !mapData.features 
          ? <CircularProgress /> 
          : <svg ref={svgRef} className={style.svgStyle}></svg>
        }
        <Popover id={style.countryPopover} 
          className={classes.popover} 
          classes={{ paper: classes.paper }} 
          open={open} 
          anchorEl={anchorEl} 
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
          transformOrigin={{ vertical: wrapperHeight / 5, horizontal: 'center' }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography variant="h4">{selectedCountryName}</Typography>
          <Typography>
            Travel to <b>{property.replace('Change', '')} locations</b> on this date was <b>{selectedCountryData[property] || 'N/A'}%</b> compared to a normal day in {selectedCountryName}.
          </Typography>
          <Button variant="contained" 
            color="primary" 
            onClick={(e) => {
              e.preventDefault();
              history.push(`/country/${selectedCountryCode}`);
            }}>Details</Button>
          {/* <Button variant="contained" color="secondary" onClick={handlePopoverClose}>X</Button> */}
        </Popover>
      </Grid>
      
      <Grid item xs={12} sm={2}>
        <Paper elivation={2} className={classes.legendPaper}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Choose a Metric</FormLabel>
            <RadioGroup row={isMobile} aria-label="position" name="metric" defaultValue="retailChange" onChange={({ target }) => setProperty(target.value)}>
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
  countryCode: PropTypes.string,
  mapData: PropTypes.object.isRequired
};

export default Map;
