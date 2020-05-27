import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './StackGraph.css';
import { select, max, scaleLinear, scaleBand, axisBottom, stackOrderAscending, stack, axisLeft } from 'd3';
import { useResizeObserver } from '../../hooks/d3Hooks';

function formatDate(badDate) {
  return badDate.toString().slice(6, 7) + '/' + badDate.toString().slice(8, 10);
}

function StackGraph({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const legendRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const [selectedDropDownKey, setSelectedDropDownKey] = useState('cases');

  const dataStructure = data.date.reduce((acc, date, i) => {
    acc.push({ 
      countryCode: data.countryCode,
      countryName: data.countryName,
      date: date.slice(5, 10),
      newCases: data.newCases[i],
      newDeaths: data.newDeaths[i],
      newRecovered: data.newRecovered[i],
      totalDeaths: data.totalDeaths[i],
      totalCases: data.totalCases[i],
      totalRecovered: data.totalRecovered[i]
    });
    return acc;
  }, []);
  console.log(dataStructure);
  useEffect(() => {
    
    const svg = select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const keys = [
      'newCases',
      'totalCases',
      'newDeaths',
      'totalDeaths',
      'newRecovered',
      'totalRecovered'
    ];

    const colors = {
      'newCases': 'Indigo',
      'totalCases': 'LightSeaGreen',
      'newDeaths': 'Indigo',
      'totalDeaths': 'LightSeaGreen',
      'newRecovered': 'Indigo',
      'totalRecovered': 'LightSeaGreen'
    };
    // stacks / layers
    const stackGenerator = stack()
      .keys(keys.filter(key => key.toLowerCase().includes(selectedDropDownKey)))
      .order(stackOrderAscending);
    const layers = stackGenerator(dataStructure);
    const extent = [
      0,
      max(layers, layer => max(layer, sequence => sequence[1]))
      // look at highest value in layer array, compare with all key layers for highest
      // second value of each array to calculate max
    ];

    // "2020-04-16T07:00:00.000Z" .slice(0, 9)
    // scales
    const xScale = scaleBand()
      .domain(dataStructure.map(d => d.date))
      .range([0, width])
      .padding(0.25);
      //scale band given explicit years
    
    const yScale = scaleLinear()
      .domain(extent)
      .range([height, 0]);
      //origin of svg at top is 0
      // scale linear continuous range of values

    // rendering
    svg
      .selectAll('.layer')
      // .data(filteredData(data, checkedOptions))
      .data(layers)
      .join('g')
      .attr('class', 'layer')
      .attr('fill', layer => colors[layer.key])
      .selectAll('rect')
      .data(layer => layer)
      .join('rect') //creates new rect for each layer
      .attr('x', sequence => xScale(sequence.data.date)) // width of each rect
      .attr('width', xScale.bandwidth())
      .attr('y', sequence => yScale(sequence[1])) //top edge of rect, determined by [1]
      .attr('height', sequence => yScale(sequence[0]) - yScale(sequence[1]));
    // create all layers of data, stack keys
    // data for rectangles is layer

    // axes
    console.log(dataStructure['date']);
    const xAxis = axisBottom(xScale)
      .tickValues(xScale.domain().filter((_, i) => i % 8 === 0));
    // .ticks(data.date.every(5));
  
    svg
      .select(`.${styles.xAxis}`)
      .attr('transform', `translate(0, ${height})`)
      .style('fill', 'black')
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg
      .select(`.${styles.yAxis}`)
      .call(yAxis);

    const legend = select(legendRef.current)
      .attr('class', `${styles.legendBox}`);

    const legendText = [`Total ${selectedDropDownKey}`, `New ${selectedDropDownKey}`];

    const colorScale = scaleLinear()
      .domain([-100, 100])
      .range(['LightSeaGreen', 'Indigo']);

    const legends = legend.selectAll('span')
      .data([-100, 100]);

    legends.join('span')
      .attr('class', `${styles.legendSpan}`)
      .style('background', (d) => colorScale(d))
      .text(legendText.forEach(number => number))
      .text((d, i) => legendText[i]);

  }), [data, dimensions, selectedDropDownKey];

  return (   
    <div className={styles.StackGraph}>
      <div ref={wrapperRef} className={styles.container}>
        <svg className="svg" ref={svgRef}>
          <g className={styles.xAxis} />
          <g className={styles.yAxis} />
        </svg>
      </div>
      <div className={styles.legendBox} ref={legendRef}></div>
      <div className={styles.select}>
        <select onChange={({ target }) => setSelectedDropDownKey(target.value)}>
          <option value="">Compare Covid cases</option>
          <option value="cases">Cases</option>
          <option value="deaths">Deaths</option>
          <option value="recovered">Recovered</option>
        </select>      
      </div>
    </div>
  );
}


StackGraph.propTypes = {
  data: PropTypes.object.isRequired,
};

export default StackGraph;
