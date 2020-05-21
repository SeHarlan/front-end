import { useState, useEffect } from 'react';
import { fetchWorldMobilityData } from '../services/mobility';
import geoJson from '../data/World-map-lo-res.geo.json';

export const useWorldMobilityData = (date) => {
  // const [fetchedData, setFetchedData] = useState(null);
  const [worldMobilityData, setworldMobilityData] = useState(null);
  
  useEffect(() => {    
    fetchWorldMobilityData(date)
      // .then(result => { 
      //   setFetchedData(result);
      // }); // if fetch and date munge are separated
      .then(mobilityData => {
        return geoJson.features.map(mapCountry => {

          const matchedMobilityData = mobilityData.find(dataCountry =>  dataCountry.countryCode === mapCountry.properties.iso_a2);

          return {
            ...mapCountry,
            mobilityData: matchedMobilityData || {}
          };
        });
      })
      .then(result => {
        setworldMobilityData(result);
      });
    
  }, [date]);

  // useEffect(() => {
  //  // will house munging process if all dates are pulled together
  // const mungedWorldMobilityData = worldMobilityData.map(())
  // setworldMobilityData(mungedWorldMobilityData)
  // }, [date]);

  return {
    'type': 'FeatureCollection',
    'features': worldMobilityData
  };
};
