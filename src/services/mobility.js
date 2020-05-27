export const fetchWorldMobilityData = (date) => {
  return fetch(`https://pandemic-legacy.herokuapp.com/api/v1/mobility/${date}`)
    .then(res => res.json());
};

export const fetchMobilityDataByCountryCode = (countryCode) => {
  return fetch(`https://pandemic-legacy.herokuapp.com/api/v1/mobility/country/${countryCode}`)
    .then(res => res.json());
};

// fetch country-level mobility data by countryCode WITH subregions
export const fetchMobilitySubregions = (countryCode) => {
  return fetch(`https://pandemic-legacy.herokuapp.com/api/v1/mobility/countryWithSub/${countryCode}`)
    .then(res => res.json());
};
