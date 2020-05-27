import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedCountryCode, getMobilityChartData } from '../../selectors/selectors';
import { setMobilityChartDataByCountryCode } from '../../actions/actions';
import { MiniChart } from './MiniChart';


export const MiniChartsContainer = () => {

  const selectedCountryCode = useSelector(getSelectedCountryCode);
  const mobilityData = useSelector(getMobilityChartData);
  const dispatch = useDispatch();
  const properties = [
    { key: 'retailChange', description: 'Retail and recreation' },
    { key: 'groceryChange', description: 'Grocery and pharmacy' },
    { key: 'transitChange', description: 'Transit stations' },
    { key: 'parksChange', description: 'Parks' },
    { key: 'workplacesChange', description: 'Workplaces' },
    { key: 'residentialChange', description: 'Residential' }
  ];
    
  
  useEffect(() => {
    dispatch(setMobilityChartDataByCountryCode(selectedCountryCode));
  }, [selectedCountryCode]);


  return (
    <>
      <Grid container spacing={3}>
        { properties.map((property, i) => 
          <Grid item xs={6} sm={4} key={i}>
            <MiniChart dataset={mobilityData} property={property} />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default MiniChartsContainer;
