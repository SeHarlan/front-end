import { useState, useEffect } from 'react';
import { fetchCovidData, fetchGlobalCovidData } from '../services/covid';

export const useCovidData = () => {

  const [covidData, setCovidData] = useState(null);

  useEffect(() => {    
//     const covidDataTemp = {};
//    fetchCovidData()
//      .then(res => {
//        covidDataTemp.date = res.map(item => item.date);
//        covidDataTemp.positive = res.map(item => item.positive ?? 0);
//        covidDataTemp.recovered = res.map(item => item.recovered ?? 0);
//        covidDataTemp.death = res.map(item => item.death ?? 0);
//        setCovidData(covidDataTemp);
//      });
//  }, []);
//
//  return covidData;

    fetchGlobalCovidData()
      .then(resultObj => {
        const formattedDate = resultObj.map(item => {
          return item.date.substr(0, 10);
          // const formattedDate = trimmedDate.replace(/\/, ''/);
        });
        console.log(formattedDate);
        setDateData(formattedDate);
        setPositiveData(resultObj.map(item => { if(item.totalCases) return item.totalCases; else return 0; }));
        setRecoveredData(resultObj.map(item => { if(item.totalRecovered) return item.totalRecovered; else return 0; }));
        setDeathData(resultObj.map(item => { if(item.totalDeaths) return item.totalDeaths; else return 0; }));
      });    
  }, []);

  return { dateData, positiveData, recoveredData, deathData };
};
