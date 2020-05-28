import { useState, useEffect } from 'react';
import { fetchWorldMobilityData, fetchMobilityDataByCountryCode } from '../services/mobility';
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


export const useMobilityDataByDate = (date) => {

  const [mobilityData, setMobilityData] = useState(null);

  useEffect(() => {
    fetchWorldMobilityData(date)
      .then(res => setMobilityData(res));
  }, [date]);

  return mobilityData;
};


// ON HOLD: Will need this backend route — show chart of mobility metrics over time for a specific location
export const useMobilityDataByCounty = (date, subRegion1, subRegion2) => {

  const [mobilityData, setMobilityData] = useState(null);

  useEffect(() => {
    fetchWorldMobilityData(date)
      .then(res => res.json())
      .then(json => setMobilityData(json));
  }, [date]);

  return mobilityData;
};

// Hits backend route that gives mobility metrics over all time for a country by code (with filtered out subregions)
export const useMobilityDataByCountryCode = (countryCode) => {

  const [mobilityData, setMobilityData] = useState(null);
  console.log('fetching');

  useEffect(() => {    
    const mobilityDataTemp = {};
    fetchMobilityDataByCountryCode(countryCode)
      .then(res => {
        const sortedRes = res.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        mobilityDataTemp.date = sortedRes.map(item => item.date);
        mobilityDataTemp.countryCode = sortedRes[0].countryCode;
        mobilityDataTemp.countryName = sortedRes[0].countryName;
        mobilityDataTemp.retailChange = sortedRes.map(item => item.retailChange ?? 0);
        mobilityDataTemp.groceryChange = sortedRes.map(item => item.groceryChange ?? 0);
        mobilityDataTemp.parksChange = sortedRes.map(item => item.parksChange ?? 0);
        mobilityDataTemp.transitChange = sortedRes.map(item => item.transitChange ?? 0);
        mobilityDataTemp.workplacesChange = sortedRes.map(item => item.workplacesChange ?? 0);
        mobilityDataTemp.residentialChange = sortedRes.map(item => item.residentialChange ?? 0);
        setMobilityData(mobilityDataTemp);
      });
  }, []);

  return mobilityData;
};

// TBDev'd: Hits backend route that gives mobility metrics over all time for a country by name (with filtered out subregions)
export const useMobilityDataByCountryName = (countryCode) => {};

// TBDev'd: Hits backend route that gives mobility metrics over all time for a country's region (i.e. state)
export const useMobilityDataByRegion1 = (country, subRegion1) => {};

// TBDev'd: Hits backend route that gives mobility metrics over all time for a country's subregion (i.e. county)
export const useMobilityDataByRegion2 = (date, country, subRegion1, subRegion2) => {

  const [mobilityData, setMobilityData] = useState(null);

  useEffect(() => {
    fetchWorldMobilityData(date)
      .then(res => res.json())
      .then(json => setMobilityData(json));
  }, [date]);

  return mobilityData;
};
