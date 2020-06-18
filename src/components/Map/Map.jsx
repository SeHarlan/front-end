import React, { useEffect, useRef, useState } from 'react';
import { select, geoPath, geoOrthographic, scaleLinear, event, drag } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';
import PropTypes from 'prop-types';

import { Slider, Popover, Typography, Button, withStyles, FormControl, Paper, Grid, RadioGroup, FormControlLabel, Radio, CircularProgress } from '@material-ui/core'; 

import style from './Map.css';

import { useDispatch, useSelector } from 'react-redux';
import { setGlobalMobilityDataByDate, setSelectedCountry } from '../../actions/actions';
import { getMobilityDates, getSelectedCountryCode, getSelectedCountryName } from '../../selectors/selectors';
import { useHistory } from 'react-router-dom';
import { useStyles } from './Map.styles';
import { useIsMobile, useScreenDimensions } from '../../hooks/isMobile';


//TO DO: move to a separate module
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
    marginLeft: -12,
  },
  active: {},
  valueLabel: {
    left: 'calc(-50%)',
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

const Map = ({ mapData }) => {
  const dates = useSelector(getMobilityDates);
  const selectedCountryCode =  useSelector(getSelectedCountryCode);
  const selectedCountryName = useSelector(getSelectedCountryName);

  const [property, setProperty] = useState('retailChange');
  const [clicked, setClicked] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [dateIndex, setDateIndex] = useState(59); //hard coded index (can't get programatically as it loads before recieving "dates" from getMobilityDates selector)
  const [selectedCountryData, setSelectedCountryData] = useState({});
  
  const { width: screenWidth } = useScreenDimensions();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  //marks for timeline slider
  const marks = (!isMobile) 
    ? [
      { value: 0, label: dates[0]?.slice(5).replace('-', '/') },
      { value: 16, label: dates[16]?.slice(5).replace('-', '/') },
      { value: 32, label: dates[32]?.slice(5).replace('-', '/') },
      { value: 48, label: dates[48]?.slice(5).replace('-', '/') },
      { value: 64, label: dates[64]?.slice(5).replace('-', '/') },
      { value: 80, label: dates[80]?.slice(5).replace('-', '/') },
      { value: 96, label: dates[96]?.slice(5).replace('-', '/') },
      { value: 112, label: dates[112]?.slice(5).replace('-', '/') },

    ]
    : [
      { value: 0, label: dates[0]?.slice(5).replace('-', '/') },
      { value: 59, label: dates[59]?.slice(5).replace('-', '/') },
      { value: 118, label: dates[118]?.slice(5).replace('-', '/') },
    ];

  //popover elements/methods
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  //D3 and svg hooks
  const svgRef = useRef();
  const wrapperRef = useRef();
  const legendRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const wrapperHeight = dimensions?.height;
 
  //resets popover to hidden upon load, reveals it when a country is selected
  useEffect(() => {
    if(!selectedCountryCode) return setAnchorEl(null);
    setAnchorEl(wrapperRef.current);
  }, [selectedCountryCode]);

  //TO DO: play with adding debouceing, should be smooth but not overload fetch requests
  //triggers fetch of global mobility data by date when the date slider is moved
  useEffect(() => {
    if(!dates.length) return;
    else dispatch(setGlobalMobilityDataByDate(dates[dateIndex]));
  }, [dateIndex]);
  
  //D3 General update pattern for globe
  useEffect(() => {
    if(!mapData.features) return;

    const svg = select(svgRef.current);

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const colorScale = scaleLinear()
      .domain([-100, 0, 100])
      .range(['#B71C1C', 'rgb(243, 240, 225)', '#1d7d0a']);

    //globe Projection
    const globePosition = [width / 2, height / 2];
    const globeScale = 1;
    const projection = geoOrthographic()
      .fitSize([width * globeScale, height * globeScale], mapData)
      .center([0, 0])
      .rotate([rotateX, rotateY, 0])
      .translate(globePosition)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    //TO DO: move to a module
    //gradient for Blue Sphere behind geoJSON svg lines
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

    //TO DO: move to a module (will need to add a "defs" declaration)
    //gragient for globe shadow
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

    //don't display shadow on mobile devices
    if(!isMobile) svg
      .selectAll('ellipse')
      .data(['spot'])
      .join('ellipse')
      .attr('cx', globePosition[0] - (width / 20))
      .attr('cy', globePosition[1] + (height / 2.06))
      .attr('rx', projection.scale() * 1.1)
      .attr('ry', projection.scale() * .25)
      .attr('class', 'noclicks')
      .style('fill', 'url(#drop_shadow)');

    //add blue gradient circle behind the geoJSON lines (countries)
    svg
      .selectAll('circle')
      .data(['spot'])
      .join('circle')
      .attr('cx', globePosition[0])
      .attr('cy', globePosition[1])
      .attr('r', projection.scale())
      .style('fill', 'url(#linear-gradient)');


    //click and drag logic
    svg.call(drag()
      .on('start', () => { 
        setRotating(true); //disables transitions for smoother dragging
        setClicked(true); //hides intructional popever
      })
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
      .on('end', () => { setRotating(false); //enables transistions so colors change smoothly when switching between properties or dates
      })
      
    );

    //add main geoGSON svg lines
    const map = svg
      .selectAll('.country')
      .data(mapData.features)
      .join('path')
      .on('click', (country) => {
        const { countryCode, countryName } = country.mobilityData;
        dispatch(setSelectedCountry({ countryCode, countryName }));
        setSelectedCountryData(country.mobilityData);
      })
      .attr('class', 'country')
      .classed(style.noData, (country) => {
        if(!country.mobilityData[property]) return style.noData;
      });
    
    if(rotating) { 
      map
        .attr('fill', country => country.mobilityData[property] 
          ? colorScale(country.mobilityData[property])
          : '#dfe2e8'
        )
        .attr('d', country => pathGenerator(country));  
    } else { 
      //if not rotating enable transitions
      map
        .transition() 
        .attr('fill', country => country.mobilityData[property] 
          ? colorScale(country.mobilityData[property])
          : '#dfe2e8'
        )
        .attr('d', country => pathGenerator(country));
    }
    
    //add choropleth legend 
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

      <Grid item xs={12} sm={9} md={2} >
        {/* TO DO: Paper elements may be unneccisery */}
        <Paper elevation={2} className={classes.legendPaper}> 
          <p>Percent increase or decrease in travel to <b>{property.replace('sChange', '').replace('Change', '')}</b> locations</p>
          <div ref={legendRef} className={style.mapLegendContainer}>
            <p className={style.legendNoData}>{(screenWidth < 960) ? 'N/A' : 'No Data Available'}</p>
          </div>
          {(screenWidth > 600) && <em className={classes.aside}>*compared to baseline, pre-pandemic measurements</em>}
        </Paper>
      </Grid>
    
      <Grid item xs={12} md={8}ref={wrapperRef} className={style.Map} >
        { !mapData.features 
          ? <CircularProgress /> //loading state
          : (<> 
            {!clicked && <Typography variant="body1" className={classes.dragLabel}>Click and drag to rotate</Typography>}
            <svg ref={svgRef} className={style.svgStyle}></svg>
          </>)
        }

        {/* TO DO: move to a module */}
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
          {selectedCountryData[property] 
            ? <Typography>
          Travel to <b>{property.replace('sChange', '').replace('Change', '')} locations</b> on this date was 
              <b className={classes.statistic}> {selectedCountryData[property]}% </b>
          compared to a normal day in {selectedCountryName}.
            </Typography>
            : <Typography>Data for <b>{property.replace('sChange', '').replace('Change', '')}</b> travel was not available for {selectedCountryName} on this date.</Typography>
          }
          <Button variant="contained" 
            className={classes.popoverButton}
            color="secondary" 
            onClick={(e) => {
              e.preventDefault();
              history.push(`/compare/${selectedCountryCode}`);
            }}>Compare</Button>
          <Button variant="contained" 
            className={classes.popoverButton}
            color="primary" 
            onClick={(e) => {
              e.preventDefault();
              history.push(`/country/${selectedCountryCode}`);
            }}>Details</Button>
        </Popover>
      </Grid>
      
      {/* TO DO: move to a module */}
      <Grid item xs={12} md={2}>
        <Paper elevation={2} className={classes.legendPaper}>
          <FormControl component="fieldset">

            {/* <FormLabel component="legend">Choose a Metric</FormLabel> */}
            <RadioGroup row={isMobile || screenWidth < 960} aria-label="position" name="metric" defaultValue="retailChange" className={classes.radioGroup} onChange={({ target }) => setProperty(target.value)}>

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
          valueLabelFormat={(index) => dates[index].slice(5).replace('-', '/')}
          marks={marks} />}
      </Grid>
    </Grid>
  </>  
  );
};

Map.propTypes = {
  mapData: PropTypes.object.isRequired
};

export default Map;
