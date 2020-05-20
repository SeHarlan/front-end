import { useState, useEffect } from 'react';
import { fetchCovidData } from '../services/covid';

export const useCovidData = () => {

  const [positiveData, setPositiveData] = useState(null);
  const [dateData, setDateData] = useState(null);

  useEffect(() => {    
    fetchCovidData()
      .then(resultObj => {
        setPositiveData(resultObj.map(item => item.positive));
        setDateData(resultObj.map(item => item.date));
      });    
  }, []);

  return { positiveData, dateData };
};
