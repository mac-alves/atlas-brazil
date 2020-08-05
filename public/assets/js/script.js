(function (d3, topoJson) {
    const inputOptions = document.querySelectorAll('input[type="radio"]');
    const load = document.querySelector('#load');
    const divOptions = document.querySelector('.options');
    const titleState = document.querySelector('#title-state');
    
    divOptions.style.display = "none";
    load.style.display = "none";
    titleState.style.display = "none";
    
    let states;
    const state = {};
    const brasil = {};
    const newMaps = ['immediate', 'intermediate'];

    const SIZES = {
        ac: { x: 1900, y: 50, scale: 4200 },
        al: { x: -1670, y: -330, scale: 10000 },
        am: { x: 810, y: 315, scale: 1800 },
        ap: { x: 700, y: 1030, scale: 5500 },
        ba: { x: -50, y: -120, scale: 3200 },
        ce: { x: -650, y: 360, scale: 6300 },
        df: { x: 180, y: -4700, scale: 29000 },
        es: { x: -800, y: -1870, scale: 9000 },
        go: { x: 400, y: -480, scale: 4400 },
        ma: { x: 120, y: 315, scale: 3600 },
        mg: { x: 160, y: -350, scale: 2800 },
        ms: { x: 750, y: -830, scale: 4300 },
        mt: { x: 650, y: -20, scale: 2700 },
        pa: { x: 470, y: 400, scale: 2420 },
        pb: { x: -1220, y: 100, scale: 7700 },
        pe: { x: -540, y: 80, scale: 4800 },
        pi: { x: -30, y: 230, scale: 4000 },
        pr: { x: 555, y: -1400, scale: 5000 },
        rj: { x: -400, y: -2000, scale: 8000 },
        rn: { x: -1465, y: 315, scale: 9000 },
        ro: { x: 1465, y: -90, scale: 4500 },
        rr: { x: 1450, y: 940, scale: 4800 },
        rs: { x: 670, y: -1510, scale: 4100 },
        sc: { x: 590, y: -2000, scale: 6000 },
        se: { x: -2480, y: -925, scale: 15000 },
        sp: { x: 320, y: -750, scale: 3600 },
        to: { x: 300, y: 80, scale: 3800 },
    }

    const loadAndProcessData = (path, camp) =>
        Promise.all([d3.json(path)])
            .then(([topoJSONData]) => {

                const countries = topoJson
                    .feature(topoJSONData, topoJSONData.objects[camp]);

                return {
                    features: countries.features
                };
            })

    brasil['projection'] = d3.geoMercator()
        .scale(800)
        .rotate([65,6,0])
        .translate([130, 170]);
            
    brasil['pathGenerator'] = d3.geoPath().projection(brasil['projection']);
    brasil['svg'] = d3.select('#brasil');
    brasil['g'] = brasil['svg'].append('g');

    // habilita o zoom no mapa 
    brasil['svg'].call(
        d3.zoom().on('zoom', () => {
            brasil['g'].attr('transform', d3.event.transform);
        })
    );

    loadAndProcessData('shared/1-br.json', 'estados').then(states => {
        brasil['g'].selectAll('path')
            .data(states.features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('id', d => d.id)
            .attr('d', brasil['pathGenerator'])
            .attr('fill', '#0b0a0d')
            .append('title')
            .text(d => d.properties['nome']);

        addOnclickInStates();
    });

    function addOnclickInStates(){
        states = document.querySelectorAll('.states');

        states.forEach(state => {
            state.addEventListener('click', 
                event => {
                    const name = event.target.querySelector('title').innerHTML;
                    selectState(event.target.id, name)
                }
            )
        });
    }

    function selectState(id, name = '', type = 'micro', brasil = true){
        document.querySelector('#state').innerHTML = '';
        load.style.display = "flex";

        if (brasil){
            document.querySelector('#micro').checked = true;
        }

        state['id'] = String(id).toLowerCase();
        state['name'] = name;
        state['type'] = newMaps.includes(type) ? 'state' : type;

        state['projection'] = d3.geoMercator()
            .scale(SIZES[state['id']].scale)
            .rotate([48, 6, 0])
            .translate([SIZES[state['id']].x, SIZES[state['id']].y]);
                
        state['pathGenerator'] = d3.geoPath().projection(state['projection']);
        state['svg'] = d3.select('#state');
        state['g'] = state['svg'].append('g');

        // habilita o zoom no mapa 
        state['svg'].call(
            d3.zoom().on('zoom', () => {
                state['g'].attr('transform', d3.event.transform);
            })
        );

        loadAndProcessData(`data/topo/${state['id'].toUpperCase()}-${type}.json`, state['type'])
            .then(states => {
                divOptions.style.display = "flex";
                load.style.display = "none";
                titleState.style.display = "block";
                titleState.innerHTML = state['name'];
                
                state['g'].selectAll('path')
                    .data(states.features)
                    .enter()
                    .append('path')
                    .attr('class', 'divisions')
                    .attr('d', state['pathGenerator'])
                    .attr('fill', '#0b0a0d')
                    .append('title')
                    .text(d => d.properties['name']);
        });
    }

    inputOptions.forEach(input => {
        input.addEventListener('change', event => setTypeGraphic(event))
    });

    function setTypeGraphic(event) {
        if (state['id']) {
            selectState(state['id'], state['name'], event.target.value, false)
        }
    }

}(d3, topojson));