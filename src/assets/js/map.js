(function (d3, topoJson) {
    'use strict';
  
    const loadAndProcessData = () => 
      Promise
        .all([
          d3.csv('https://gist.githubusercontent.com/curran/e7ed69ac1528ff32cc53b70fdce16b76/raw/61f3c156efd532ae6ed84b38102cf9a0b3b1d094/data.csv'),
          d3.json('../maps/world-50m.json')
        ])
        .then(([unData, topoJSONData]) => {
         
          const rowById = unData.reduce((accumulator, d) => {
            accumulator[d['Country code']] = d;      
            return accumulator;
          }, {});
          // console.log(rowById);
          
          const countries = topoJson.feature(topoJSONData, topoJSONData.objects.countries);
          console.log(countries);
          
          countries.features.forEach(d => {
            Object.assign(d.properties, rowById[+d.id]);
          });
          
          const featuresWithPopulation = countries.features
            .filter(d => {
              // console.log(d)
              return d.properties['2018']
            })
            .map(d => {
              d.properties['2018'] = +d.properties['2018'].replace(/ /g, '') * 1000;
              return d;
            });
          console.log(featuresWithPopulation);

          return {
            features: countries.features,
            featuresWithPopulation
          };
        });
  
    const sizeLegend = (selection, props) => {
      const {
        sizeScale,
        spacing,
        textOffset,
        numTicks,
        tickFormat
      } = props;
      
      // gera a escala do lado do gráfico
      const ticks = sizeScale.ticks(numTicks)
        .filter(d => d !== 0)
        .reverse();
  
      const groups = selection.selectAll('g').data(ticks);
      // cria os grupos um da scala um em cima do outro
      const groupsEnter = groups
          .enter()
          .append('g')
          .attr('class', 'tick');

      // espaça os grupos entre se para poder visualizar melhor
      groupsEnter
        .merge(groups)
        .attr('transform', (d, i) =>
            `translate(0, ${i * spacing})`
        );

      groups.exit().remove();
      
      // adiciona um circulo identificando o grupo
      groupsEnter.append('circle')
          .merge(groups.select('circle'))
          .attr('r', sizeScale);
      
      // adiciona o texto do grupo
      groupsEnter.append('text')
        .merge(groups.select('text'))
          .text(tickFormat)
          .attr('dy', '0.32em')
          .attr('x', d => sizeScale(d) + textOffset);
      
    };
  
    const svg = d3.select('svg');
  
    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);
    const radiusValue = d => d.properties['2018'];
  
    const g = svg.append('g');
  
    // const colorLegendG = svg.append('g').attr('transform', `translate(40,310)`);
  
    g.append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }));
  
    // svg.call(
    //   d3.zoom().on('zoom', () => {
    //     g.attr('transform', d3.event.transform);
    //   })
    // );
  
    const populationFormat = d3.format(',');
  
    loadAndProcessData().then(countries => {
      const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(countries.features, radiusValue)])
        .range([0, 33]);
  
      g.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .attr('fill', d => (d.properties['2018'] ? '#e8e8e8' : '#fecccc'))
        .append('title')
        .text(d =>
          isNaN(radiusValue(d))
            ? 'Missing data'
            : [
                d.properties['Region, subregion, country or area *'],
                populationFormat(radiusValue(d))
              ].join(': ')
        );
      // console.log(countries.featuresWithPopulation);
      // countries.featuresWithPopulation.forEach(d => {
      //   d.properties.projected = projection(d3.geoCentroid(d));
      // });
  
      // adiciona a bolinha na região 
      g.selectAll('circle')
        .data(countries.featuresWithPopulation)
        .enter()
        .append('circle')
        .attr('class', 'country-circle')
        .attr('cx', d => d.properties.projected[0])
        .attr('cy', d => d.properties.projected[1])
        .attr('r', d => sizeScale(radiusValue(d)));
  
      g.append('g')
        .attr('transform', `translate(45,215)`)
        .call(sizeLegend, {
          sizeScale,
          spacing: 45,
          textOffset: 10,
          numTicks: 5,
          tickFormat: populationFormat
        })
        .append('text')
        .attr('class', 'legend-title')
        .text('Population')
        .attr('y', -45)
        .attr('x', -30);
    });
  
  }(d3, topojson));