import { fetchMobilityDataByCountryCode, fetchWorldMobilityData, fetchMobilitySubregions, fetchMobilitySubData } from '../services/mobility';
import geoJson from '../data/World-map-lo-res.geo.json';
import USgeoJson from '../data/US-States.geo.json';
import { fetchCountryCovidData, fetchCovidSubData } from '../services/covid';


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
export const SET_US_MAP_MOBILITY_BY_DATE = 'SET_US_MAP_MOBILITY_BY_DATE';
export const setUSMobilityDataByDate = (date) => dispatch => {
  return fetchMobilitySubregions('US')
    .then(mobilityData => {
      const mobilityDataByDate = mobilityData.reduce((acc, curr) => {
        if(curr.subRegion1 !== null && curr.date.includes(date)) acc.push(curr);
        return acc;
      }, []);
      return USgeoJson.features.map(mapFeature=> {
        const matchedMobilityData = mobilityDataByDate.find(mobilityItem => {
          return  mobilityItem.subRegion1 === mapFeature.properties.NAME;
        });
        return {
          ...mapFeature,
          mobilityData: matchedMobilityData
        };
      });
    })
    .then(mungedGeoJson => {
      dispatch({
        type: SET_US_MAP_MOBILITY_BY_DATE,
        payload: {
          'type': 'FeatureCollection',
          'features': mungedGeoJson
        }
      });
    });
};

export const SET_MOBILITY_CHART_DATA = 'SET_MOBILITY_CHART_DATA';
export const setMobilityChartDataByCountryCode = (countryCode) => dispatch => {
  fetchMobilityDataByCountryCode(countryCode)
    .then(res => res.slice().sort((a, b) => new Date(a.date) - new Date(b.date)))
    .then(sortedRes => ({
      date: sortedRes.map(item => item.date),
      countryCode: sortedRes[0].countryCode,
      countryName: sortedRes[0].countryName,
      retailChange: sortedRes.map(item => item.retailChange ?? 0),
      groceryChange: sortedRes.map(item => item.groceryChange ?? 0),
      parksChange: sortedRes.map(item => item.parksChange ?? 0),
      transitChange: sortedRes.map(item => item.transitChange ?? 0),
      workplacesChange: sortedRes.map(item => item.workplacesChange ?? 0),
      residentialChange: sortedRes.map(item => item.residentialChange ?? 0),
    }))
    .then(formattedRes => {
      dispatch({
        type: SET_MOBILITY_CHART_DATA,
        payload: formattedRes
      });
    });
};

export const SET_COVID_CHART_DATA = 'SET_COVID_CHART_DATA';
export const setCovidChartData = (countryCode) => dispatch => {
  return fetchCountryCovidData(countryCode)
    .then(res => ({
      date: res.map(item => item.date),
      countryCode: res[0].countryCode,
      countryName: res[0].countryName,
      totalCases: res.map(item => item.totalCases ?? 0),
      newCases: res.map(item => item.newCases ?? 0),
      totalRecovered: res.map(item => item.totalRecovered ?? 0),
      newRecovered: res.map(item => item.newRecovered ?? 0),
      totalDeaths: res.map(item => item.totalDeaths ?? 0),
      newDeaths: res.map(item => item.newDeaths ?? 0),
      totalCurrentCases: res.map(item => (item.totalCases ?? 0) - (item.totalRecovered ?? 0))
    }))
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
    payload: countryCode.toUpperCase()
  });
};
export const SET_SELECTED_COUNTRY_NAME = 'SET_SELECTED_COUNTRY_NAME';
export const setSelectedCountryName = (countryName) => dispatch => {
  dispatch({
    type: SET_SELECTED_COUNTRY_NAME,
    payload: countryName
  });
};
export const SET_SELECTED_COUNTRY = 'SET_SELECTED_COUNTRY';
export const setSelectedCountry = ({ countryName, countryCode }) => dispatch => {
  dispatch({
    type: SET_SELECTED_COUNTRY,
    payload: { countryName, countryCode }
  });
};

export const SET_SELECTED_SUBREGION = 'SET_SELECTED_SUBREGION';
export const setSelectedSubregion = (subregion) => dispatch => {
  dispatch({
    type: SET_SELECTED_SUBREGION,
    payload: subregion
  });
};

export const SET_MOBILITY_DATES = 'SET_MOBILITY_DATES';
export const setMobilityDates = () => dispatch => {
  return fetchMobilityDataByCountryCode('CA')
    .then(res => res.map(item => item.date.slice(0, 10)))
    .then(dates => {
      dispatch({
        type: SET_MOBILITY_DATES,
        payload: dates.sort()
      });
    });
};

export const SET_MOBILITY_SUBREGION_NAMES = 'SET_MOBILITY_SUBREGION_NAMES';
export const setMobilitySubregionNames = (countryCode) => dispatch => {
  fetchMobilitySubregions(countryCode)
    .then(res => {  
      return res.reduce((acc, curr) => {
        if(curr.subRegion1 === null) return acc;
        if(acc?.includes(curr.subRegion1)) return acc;
        acc.push(curr.subRegion1);
        return acc;
      }, []);
    })
    .then(subRegion1Names => {
      dispatch({
        type: SET_MOBILITY_SUBREGION_NAMES,
        payload: subRegion1Names
      });
    });
};

export const SET_COVID_SUBREGIONS = 'SET_COVID_SUBREGIONS';
export const setCovidSubregions = (countryCode) => dispatch => {
  return fetchCountryCovidData(countryCode)
    .then(res => ({
      date: res.map(item => item.date),
      countryCode: res[0].countryCode,
      countryName: res[0].countryName,
      subRegion1: res[0].subRegion1,
      subRegion2: res[0].subRegion2,
      totalCases: res.map(item => item.totalCases ?? 0),
      newCases: res.map(item => item.newCases ?? 0),
      totalRecovered: res.map(item => item.totalRecovered ?? 0),
      newRecovered: res.map(item => item.newRecovered ?? 0),
      totalDeaths: res.map(item => item.totalDeaths ?? 0),
      newDeaths: res.map(item => item.newDeaths ?? 0)
    }))
    .then(covidSubregions => {
      dispatch({
        type: SET_COVID_SUBREGIONS,
        payload: covidSubregions
      });
    });
};
export const SET_COVID_SUB_DATA = 'SET_COVID_SUB_DATA';
export const setCovidSubData = (countryCode, subRegion1) => dispatch => {
  return fetchCovidSubData(countryCode, subRegion1)
    .then(res => ({
      date: res.map(item => item.date),
      countryCode: res[0].countryCode,
      countryName: res[0].countryName,
      subRegion1: res.map(item => item.subRegion1 ?? 0),
      totalCases: res.map(item => item.totalCases ?? 0),
      newCases: res.map(item => item.newCases ?? 0),
      totalRecovered: res.map(item => item.totalRecovered ?? 0),
      newRecovered: res.map(item => item.newRecovered ?? 0),
      totalDeaths: res.map(item => item.totalDeaths ?? 0),
      newDeaths: res.map(item => item.newDeaths ?? 0)
    }))
    .then(covidSubData => {
      dispatch({
        type: SET_COVID_SUB_DATA,
        payload: covidSubData
      });
    });
};

export const SET_MOBILITY_SUB_DATA = 'SET_MOBILITY_SUB_DATA';
export const setMobilitySubData = (countryCode, subRegion1) => dispatch => {
  fetchMobilitySubData(countryCode, subRegion1)
    .then(res => res.slice().sort((a, b) => new Date(a.date) - new Date(b.date)))
    .then(sortedRes => ({
      date: sortedRes.map(item => item.date),
      countryCode: sortedRes[0].countryCode,
      countryName: sortedRes[0].countryName,
      subRegion1: sortedRes.map(item => item.subRegion1 ?? 0),
      retailChange: sortedRes.map(item => item.retailChange ?? 0),
      groceryChange: sortedRes.map(item => item.groceryChange ?? 0),
      parksChange: sortedRes.map(item => item.parksChange ?? 0),
      transitChange: sortedRes.map(item => item.transitChange ?? 0),
      workplacesChange: sortedRes.map(item => item.workplacesChange ?? 0),
      residentialChange: sortedRes.map(item => item.residentialChange ?? 0),
    }))
    .then(formattedRes => {
      dispatch({
        type: SET_MOBILITY_SUB_DATA,
        payload: formattedRes
      });
    });
};

export const RESET_COVID_SUB_DATA = 'RESET_COVID_SUB_DATA';
export const resetCovidSubData = () => dispatch => {
  dispatch({
    type: RESET_COVID_SUB_DATA,
  });
};
