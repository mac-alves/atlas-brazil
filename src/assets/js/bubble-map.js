(function (d3, topoJson) {
    'use strict';
    const MAP_JSON = '../maps/ma.json';
    const DATA_JSON = '../data/data-ma.json';
    const SIZE = {
        wight: 480,
        height: 720
    }
    const COLORS = {
      pole_not_value: '#fecccc',
      pole_value: '#e8e8e8'
    }

    const loadAndProcessData = () =>
        Promise.all([
          d3.json(MAP_JSON), 
          d3.json(DATA_JSON)
        ])
        .then(([topoJSONData, infoDataJson]) => {

            const countries = topoJson
              .feature(topoJSONData, topoJSONData.objects.polos);
              
            countries.features.forEach(d => {
              Object.assign(d.properties, infoDataJson[d.id]);
            });

            return {
              features: countries.features,
              featuresWithPopulation: countries.features
            };
        })

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
    const projection = d3.geoMercator()
        .scale(1200 * 3)
        .rotate([45.2,6,0])
        .translate([SIZE.wight/2, SIZE.height/2]);

    const pathGenerator = d3.geoPath().projection(projection);
    const radiusValue = d => d.properties['value'];
    const g = svg.append('g');
    const colorLegendG = svg.append('g').attr('transform', `translate(40,310)`);
    const populationFormat = d3.format(',');

    g.append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }));
  
    // habilita o zoom no mapa 
    svg.call(
      d3.zoom().on('zoom', () => {
        g.attr('transform', d3.event.transform);
      })
    );

    loadAndProcessData().then(polos => {
      const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(polos.features, radiusValue)])
        .range([0, 33]);

      g.selectAll('path')
        .data(polos.features)
        .enter()
        .append('path')
        .attr('class', 'polos')
        .attr('d', pathGenerator)
        .attr('fill', d => 
          (d.properties['value'] ? COLORS.pole_value : COLORS.pole_not_value)
        )
        .append('title')
        .text(d =>
          isNaN(radiusValue(d))
            ? 'Missing data'
            : [
                d.properties['name'],
                populationFormat(radiusValue(d))
              ].join(': ')
          );

      polos.featuresWithPopulation.forEach(d => {
        d.properties.projected = projection(d3.geoCentroid(d));
      });
        
      g.selectAll('circle')
        .data(polos.featuresWithPopulation)
        .enter()
        .append('circle')
        .attr('class', 'country-circle')
        .attr('cx', d => d.properties.projected[0])
        .attr('cy', d => d.properties.projected[1])
        .attr('r', d => sizeScale(radiusValue(d)));

      g.append('g')
        .attr('transform', `translate(460,415)`)
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