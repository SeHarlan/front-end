export const fetchWorldMapMobility = () => {
  return fetch('https://pandemic-legacy.herokuapp.com/api/v1/mobility')
    .then(res => res.json());
};
