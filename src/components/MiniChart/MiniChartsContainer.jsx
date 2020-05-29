import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedCountryCode, getMobilityChartData, getMobilitySubData, getMobilityCompareCountryCode, getMobilityCompareChartData } from '../../selectors/selectors';
import { setMobilityChartDataByCountryCode, setMobilityCompareChartDataByCountryCode } from '../../actions/actions';
import { MiniChart } from './MiniChart';


export const MiniChartsContainer = () => {

  const selectedCountryCode = useSelector(getSelectedCountryCode);
  const compareCountryCode = useSelector(getMobilityCompareCountryCode);
  const mobilityData = useSelector(getMobilityChartData);
  const miniChartSubData = useSelector(getMobilitySubData);
  const mobilityCompareData = useSelector(getMobilityCompareChartData);
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

  useEffect(() => {
    dispatch(setMobilityCompareChartDataByCountryCode(compareCountryCode));
  }, [compareCountryCode]);

  return (
    <>
      <Grid container spacing={3}>
        { properties.map((property, i) => 
          <Grid item xs={12} sm={6} lg={4} key={i}>
            { miniChartSubData.date
              ? <MiniChart dataset={miniChartSubData} compareDataset={{}} property={property} />
              : <MiniChart dataset={mobilityData} compareDataset={mobilityCompareData} property={property} />
            }
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default MiniChartsContainer;
