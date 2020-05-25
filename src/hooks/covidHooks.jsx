import { useState, useEffect } from 'react';
import { fetchCovidData, fetchGlobalCovidData } from '../services/covid';

export const useCovidData = () => {

  const [dateData, setDateData] = useState(null);
  const [positiveData, setPositiveData] = useState(null);
  const [recoveredData, setRecoveredData] = useState(null);
  const [deathData, setDeathData] = useState(null);

  useEffect(() => {    
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

  // const [dateData, setDateData] = useState(null);
  // const [positiveData, setPositiveData] = useState(null);
  // const [recoveredData, setRecoveredData] = useState(null);
  // const [deathData, setDeathData] = useState(null);

  // useEffect(() => {    
  //   fetchGlobalCovidData()
  //     .then(resultObj => {
  //       setDateData(resultObj.map(item => item.date));
  //       setPositiveData(resultObj.map(item => { if(item.positive) return item.positive; else return 0; }));
  //       setRecoveredData(resultObj.map(item => { if(item.recovered) return item.recovered; else return 0; }));
  //       // setRecoveredData(resultObj.map((item, index) => { 
  //       //   if(item.recovered && positiveData[index]) 
  //       //     return (positiveData[index] - item.recovered); 
  //       //   else return 0; 
  //       // }));
  //       setDeathData(resultObj.map(item => { if(item.death) return item.death; else return 0; }));
  //     });    
  // }, []);

  // return { dateData, positiveData, recoveredData, deathData };
};
