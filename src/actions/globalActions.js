import { fetchWorldMobilityData } from '../services/mobility';
import geoJson from '../data/World-map-lo-res.geo.json';


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
