import { fetchWorldMobilityData } from '../services/mobility';
import geoJson from '../data/World-map-lo-res.geo.json';
import { fetchCountryCovidData } from '../services/covid';


export const SET_GLOBAL_MAP_MOBILITY_BY_DATE = 'SET_GLOBAL_MAP_MOBILITY_BY_DATE';
export const setGlobalMobilityDataByDate = (date) => dispatch => {
  return fetchWorldMobilityData(date)
    .then(mobilityData => {
      return geoJson.features.map(mapCountry => {

        const matchedMobilityData = mobilityData.find(dataCountry =>  dataCountry.countryCode === mapCountry.properties.iso_a2);

        return {
          ...mapCountry,
          mobilityData: matchedMobilityData || {}
        };
      });
    })
    .then(mungedGeoJson => {
      dispatch({
        type: SET_GLOBAL_MAP_MOBILITY_BY_DATE,
        payload: {
          'type': 'FeatureCollection',
          'features': mungedGeoJson
        }
      });
    });
};

export const SET_COVID_CHART_DATA = 'SET_COVID_CHART_DATA';
export const setCovidChartData = (countryCode) => dispatch => {
  return fetchCountryCovidData(countryCode)
    .then(res => 
    {
      console.log(res);
      return ({
        date: res.map(item => item.date),
        countryCode: res[0].countryCode,
        countryName: res[0].countryName,
        totalCases: res.map(item => item.totalCases ?? 0),
        newCases: res.map(item => item.newCases ?? 0),
        totalRecovered: res.map(item => item.totalRecovered ?? 0),
        newRecovered: res.map(item => item.newRecovered ?? 0),
        totalDeaths: res.map(item => item.totalDeaths ?? 0),
        newDeaths: res.map(item => item.newDeaths ?? 0)
      });
    })
    .then(covidData => {
      dispatch({
        type: SET_COVID_CHART_DATA,
        payload: covidData
      });
    });
};

export const SET_SELECTED_COUNTRY_CODE = 'SET_SELECTED_COUNTRY_CODE';
export const setSelectedCountryCode = (countryCode) => dispatch => {
  dispatch({
    type: SET_SELECTED_COUNTRY_CODE,
    payload: countryCode.toUppercase()
  });
};
