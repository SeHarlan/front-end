export const fetchCovidData = () => {
  return fetch('https://covidtracking.com/api/v1/us/daily.json')
    .then(res => res.json());
};
