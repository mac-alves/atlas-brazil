const URL_JSON = '../data/ma.json';
const width = 480,
    height = 720;

// var projection = d3.geo.mercator()
//     .center([0, 55.4])
//     .rotate([4.4, 0])
//     .parallels([10, 0])
//     // .scale(1200 * 5)
//     .translate([width / 2, height / 2]);

const projection = d3.geo.mercator()
    .scale(1200 * 3)
    .rotate([45.2,6,0])
    .translate([width/2, height/2])

const path = d3.geo.path()
    .projection(projection);

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
// topo/ma-meso
// uk subunits
d3.json(URL_JSON, function(error, uk) {
    if (error) return console.error(error);
    console.log(uk);

    svg.selectAll(".subunit")
        .data(topojson.feature(uk, uk.objects.micro).features)
        .enter().append("path")
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", path);

    svg.append("path")
        .datum(topojson.feature(uk, uk.objects.places))
        .attr("d", path)
        .attr("class", "place");

    svg.selectAll(".place-label")
        .data(topojson.feature(uk, uk.objects.places).features)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
        .text(function(d) { return d.properties.name; });
});


