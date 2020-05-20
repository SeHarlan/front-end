import React, { useState } from 'react';
import Map from '../Map/Map';
import geoJson from '../../data/World-map-lo-res.geo.json';

const Home = () => {
  const [property, setProperty] = useState('pop_est');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  return (
    <>
      <Map geoJson={geoJson} property={property} rotateX={rotateX} rotateY={rotateY} />;
      <select value={property} onChange={({ target }) => setProperty(target.value)}>
        <option value="pop_est">Population</option>
        <option value="name_len">Name Length</option>
        <option value="gdp_md_est">GDP</option>
      </select>
      <span>rotate X</span>
      <input type="range" min="-180" max="180" step="0.5" value={rotateX} onChange={({ target }) => setRotateX(target.value)}/>
      <span>rotate Y</span>
      <input type="range" min="-180" max="180" step="0.5" value={rotateY} onChange={({ target }) => setRotateY(target.value)}/>
    </>
  );
};

export default Home;
