export const fetchWorldMobilityData = (date) => {
  return fetch(`https://pandemic-legacy.herokuapp.com/api/v1/mobility/${date}`)
    .then(res => res.json());
};

export const fetchMobilityDataByCountryCode = (countryCode) => {
  return fetch(`https://pandemic-legacy.herokuapp.com/api/v1/mobility/country/${countryCode}`)
    .then(res => res.json());
};
