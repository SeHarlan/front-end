export const fetchWorldMobilityData = (date) => {
  return fetch(`https://pandemic-legacy.herokuapp.com/api/v1/mobility/${date}`)
    .then(res => res.json());
};
