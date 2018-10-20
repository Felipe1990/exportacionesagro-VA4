// data functions
var formatThousand=d3.format(",");
var parseDate=d3.timeParse('%m-%Y');

var stack = d3.stack()
    .keys(["Agro", "Combustibles", "Manufacturas", "Otros"])
    .offset(d3.stackOffsetSilhouette)
    .order(d3.stackOrderDescending);

// graph
var generalWidth=960,
    margin = {top: 20, right: 50, bottom: 20, left: 30},
    width = generalWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var bodyChange=d3.select("body").select(".stream")
  .style("width", generalWidth+"px")

var svg = d3.select("body").select(".stream").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// axis
var y = d3.scaleLinear()
    .range([height, 0], 0.1);

var x = d3.scaleTime()
    .range([0, width*0.9]);

var z = d3.scaleOrdinal(d3.schemeAccent)
          .domain(["Agro", "Combustibles", "Manufacturas", "Otros"]);

//https://github.com/d3/d3-scale-chromatic/blob/master/README.md

var area = d3.area()
    .x((d, i) => x(fechas[i]))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

// tooltip
var div = d3.select("body").select(".stream").append("div") 
   .attr("background", "lightsteelblue")
   .attr("class", "tooltip")          
   .style("opacity", 0);

// enter de data
d3.csv("data/export.csv")
  .then(data => {
        return data.map(d => {
          d.fecha=parseDate(d.fecha)
          d.agro=+d.agro
          d.combustibles=+d.combustibles
          d.manufacturas=+d.manufacturas
          d.otros=+d.otros;
          return d;  
        });
        })
  .then(data => {
  
  fechas=data.map(d=>d.fecha);
  datasor=stack(data);
  
  x.domain(d3.extent(data, d => d.fecha)).nice();
  y.domain([-4000000, 4000000]).nice();

  // svg.append("g")
  //   .call(d3.axisLeft(y))
  //   .attr("class", "y axis")
  //   .attr("transform", "translate(40, 0)");

  svg.append("g")
    .call(d3.axisBottom(x))
    .attr("class", "x axis")
    .attr("transform", "translate(10," + height + ")");

  svg.selectAll(".layer")
      .data(datasor)
    .enter().append("path")
      .attr("d", area)
      .attr("fill", d => z(d.key))
      .style("stroke", "black")
      .attr("transform", "translate(10, 0)")
      .on("mouseover", d=>tooltipOn(d))
      .on("mouseout", tooltipOver);

});

tooltipOn = function(d){
  div
    .html("Categoria: " + "<br>" +d.key)
    .transition()
    .duration(100)
    .style("opacity", 0.8)
};

tooltipOver = function(){
  div
    .transition()
    .duration(100)
    .style("opacity", 0)
};

// update

// check.onclick = function() {
//   console.log(this.__data__)
// };
// console.log(check[0]);
// html body svg g g.y.axis g.tick