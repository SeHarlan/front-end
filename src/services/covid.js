// fetch from third-party API
export const fetchCovidData = () => {
  return fetch('https://covidtracking.com/api/v1/us/daily.json')
    .then(res => res.json());
};

// fetch global-level data from back end
export const fetchGlobalCovidData = () => {
  return fetch('https://pandemic-legacy.herokuapp.com/api/v1/covid/')
    .then(res => res.json());
};

// fetch country-level covid data by countryCode
export const fetchCountryCovidData = (countryCode = '') => {
  return fetch(`https://pandemic-legacy.herokuapp.com/api/v1/covid/${countryCode}`)
    .then(res => res.json());
};

// fetch country-level covid data by countryCode
export const fetchCountryNameCovidData = (countryName = '') => {
  return fetch(`https://pandemic-legacy.herokuapp.com/api/v1/covid/${countryName}`)
    .then(res => res.json());
};
