import React, { useState, useEffect } from 'react';
import LineGraph from '../LineGraph/LineGraph';
import { Container, CssBaseline } from '@material-ui/core';
import { useStyles } from '../ComparePage/ComparePage.styles';
import { useCovidData } from '../../hooks/covidHooks';
import { useMobilityDataByCountryCode } from '../../hooks/mobilityHooks';
import { fetchMobilityDataByCountryCode } from '../../services/mobility';


export const ComparePage = () => {

  // const covidData = useCovidData();
  // const covidYAxis = [0, Math.max(...covidData['positive'])];
  const [selectedCountry, setSelectedCountry] = useState('GB');
  const [mobilityData, setMobilityData] = useState({});
  const mobilityYAxis = [-100, 50];
  const styles = useStyles();

  const handleRadioChange = ({ target }) => {
    setSelectedCountry(target.value);
  };

  // Violates the rules of hooks? Help!
  // useEffect(() => {
  //   const fetchedData = useMobilityDataByCountryCode(selectedCountry);
  //   setMobilityData(fetchedData);
  // }, [selectedCountry]);

  useEffect(() => {
    const mobilityDataTemp = {};
    if(selectedCountry !== 'Compare') {
      fetchMobilityDataByCountryCode(selectedCountry)
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
    } else {
      const mobilityDataUSTemp = {};
      const mobilityDataGBTemp = {};
      fetchMobilityDataByCountryCode('US')
        .then(res => {
          const sortedRes = res.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
          mobilityDataUSTemp.date = sortedRes.map(item => item.date);
          mobilityDataUSTemp.countryCode = sortedRes[0].countryCode;
          mobilityDataUSTemp.countryName = sortedRes[0].countryName;
          mobilityDataUSTemp.retailChange = sortedRes.map(item => item.retailChange ?? 0);
          mobilityDataUSTemp.groceryChange = sortedRes.map(item => item.groceryChange ?? 0);
          mobilityDataUSTemp.parksChange = sortedRes.map(item => item.parksChange ?? 0);
          mobilityDataUSTemp.transitChange = sortedRes.map(item => item.transitChange ?? 0);
          mobilityDataUSTemp.workplacesChange = sortedRes.map(item => item.workplacesChange ?? 0);
          mobilityDataUSTemp.residentialChange = sortedRes.map(item => item.residentialChange ?? 0);
        });
      fetchMobilityDataByCountryCode('GB')
        .then(res => {
          const sortedRes = res.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
          mobilityDataGBTemp.date = sortedRes.map(item => item.date);
          mobilityDataGBTemp.countryCode = sortedRes[0].countryCode;
          mobilityDataGBTemp.countryName = sortedRes[0].countryName;
          mobilityDataGBTemp.retailChange = sortedRes.map(item => item.retailChange ?? 0);
          mobilityDataGBTemp.groceryChange = sortedRes.map(item => item.groceryChange ?? 0);
          mobilityDataGBTemp.parksChange = sortedRes.map(item => item.parksChange ?? 0);
          mobilityDataGBTemp.transitChange = sortedRes.map(item => item.transitChange ?? 0);
          mobilityDataGBTemp.workplacesChange = sortedRes.map(item => item.workplacesChange ?? 0);
          mobilityDataGBTemp.residentialChange = sortedRes.map(item => item.residentialChange ?? 0);
        });
      mobilityDataTemp.US = mobilityDataUSTemp;
      mobilityDataTemp.GB = mobilityDataGBTemp;
      setMobilityData(mobilityDataTemp);
    }
  }, [selectedCountry]);


  return (
    <>
      <Container maxWidth="xl" className={styles.root}>
        <CssBaseline />
        {console.log('in ComparePage, mobilityData is', mobilityData)}
        <LineGraph dataset={mobilityData} yAxisConstraints={mobilityYAxis} />
        <input type="radio" id="radioUS" name="country" value="US" onChange={handleRadioChange} checked={selectedCountry === 'US'} />
        <label htmlFor="radioUS">United States</label>
        <input type="radio" id="radioGB" name="country" value="GB" onChange={handleRadioChange} checked={selectedCountry === 'GB'} />
        <label htmlFor="radioGB">Great Britain</label>
        <input type="radio" id="radioCompare" name="country" value="Compare" onChange={handleRadioChange} checked={selectedCountry === 'Compare'} />
        <label htmlFor="radioCompare">Compare</label>
      </Container>
    </>
  );
};

export default ComparePage;
