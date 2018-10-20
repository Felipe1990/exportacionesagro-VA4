// data functions
var formatThousand=d3.format(",");
var parseDate=d3.timeParse('%m-%Y');

var stack = d3.stack()
    .keys(["agro", "combustibles", "manufacturas", "otros"])
    .offset(d3.stackOffsetNone)
    .order(d3.stackOrderNone);

// graph
var generalWidth=960,
    margin = {top: 20, right: 50, bottom: 40, left: 30},
    width = generalWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var bodyChange=d3.select("body")
  .style("width", generalWidth+"px")

var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// axis
var y = d3.scaleLinear()
    .range([height, 0], 0.1)
    .domain([0, 2000000]);

var x = d3.scaleTime()
    .range([0, width*1]);

var z = d3.interpolateViridis;

//https://github.com/d3/d3-scale-chromatic/blob/master/README.md

var area = d3.area()
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

// tooltip
var div = d3.select("body").append("div") 
   .attr("background", "lightsteelblue")
   .attr("class", "tooltip")          
   .style("opacity", 0);


// enter de data
d3.csv("data/export.csv")
  .then(data => {
        return data.map((d) => {
          d.fecha=parseDate(d.fecha)
          d.FOB=+d.FOB;
          return d;  
        });
        })
  .then(data => {
  
  x.domain(d3.extent(data, d => d.fecha)).nice();

  datasor=stack(data)
  
  console.log(datasor);
// stacking 

  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("class", "y axis");

  svg.append("g")
    .call(d3.axisBottom(x))
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");


  svg.selectAll("path")
      .data(datasor[0])
    .enter().append("path")
      .attr("d", area)
      .attr("fill", () => z(Math.random()));



});

// update

// check.onclick = function() {
//   console.log(this.__data__)
// };
// console.log(check[0]);
// html body svg g g.y.axis g.tick