// graph

var bodyChangeline=d3.select("body").select(".lineplot")
  .style("width", generalWidth+"px")

var svgline = d3.select("body").select(".lineplot").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// axis
var yline = d3.scaleLinear()
    .range([height, 0], 0.1);

var xline = d3.scaleTime()
    .range([0, width*0.9]);

//drawing lines from points

var drawTotal=d3.line()
      .x(d => xline(d.fecha))
      .y(d => yline(d.total));

var drawNocomb=d3.line()
      .x(d => xline(d.fecha))
      .y(d => yline(d.nocom));


// enter de data
d3.csv("data/export2.csv")
  .then((data) => {
        return data.map((d) => {
          d.fecha = parseDate(d.fecha)
          d.total = +d.share_total
          d.nocom = +d.share_nocom
          return d;  
        });
        })
  .then(data => {

  yline.domain([Math.min(d3.min(data, d=>d.total), d3.min(data, d=>d.nocom))-2, 
                Math.max(d3.max(data, d=>d.total), d3.max(data, d=>d.nocom))])
        .nice();
  xline.domain(d3.extent(data, d=> d.fecha))

  svgline.append("path")
    .attr("class", "pathline-total")
    .attr("stroke", "steelblue")
    .attr("d", drawTotal(data))
    .style("fill", "none");

  svgline.append("path")
    .attr("class", "pathline-nocom")
    .attr("stroke", "red")
    .attr("d", drawNocomb(data))
    .style("fill", "none");

  svgline.append("g")
    .attr("class", "x-axis-line")
    .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xline));

  svgline.append("g")
  .attr("class", "y-axis-line")
    .call(d3.axisLeft(yline));

  svgline.append("rect")
    .attr("x", xline(parseDate("7-2006")))
    .attr("y", yline(Math.max(d3.max(data, d=>d.share_total), d3.max(data, d=>d.share_nocom))*0.9))
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "steelblue");

  svgline.append("rect")
      .attr("x", xline(parseDate("7-2006")))
      .attr("y", yline(Math.max(d3.max(data, d=>d.share_total), d3.max(data, d=>d.share_nocom))*0.94))
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", "red");

  svgline.append("text")
    .attr("class", "labelSalidas")
    .attr("x", xline(parseDate("10-2006")))
    .attr("y", yline(Math.max(d3.max(data, d=>d.share_total), d3.max(data, d=>d.share_nocom))*0.9)+10)
    .style("font-size", "12px")
    .html("% total");

  svgline.append("text")
    .attr("class", "labelSalidas")
    .attr("x", xline(parseDate("10-2006")))
    .attr("y", yline(Math.max(d3.max(data, d=>d.share_total), d3.max(data, d=>d.share_nocom))*0.94)+10)
    .style("font-size", "12px")
    .text("% total sin combustibles");


});


// update normal

function updateNormal() {
d3.csv("data/export2.csv")
  .then((data) => {
        return data.map((d) => {
          d.fecha = parseDate(d.fecha)
          d.total = +d.share_total
          d.nocom = +d.share_nocom
          return d;  
        });
        })
  .then(data => {

  yline.domain([Math.min(d3.min(data, d=>d.total), d3.min(data, d=>d.nocom))-2, 
                Math.max(d3.max(data, d=>d.total), d3.max(data, d=>d.nocom))])
        .nice();
  xline.domain(d3.extent(data, d=> d.fecha));

  d3.selectAll(".pathline-total")
    .transition()
    .duration(750)
    .attr("d", drawTotal(data));

  d3.selectAll(".pathline-nocom")
    .transition()
    .duration(750)
    .attr("d", drawNocomb(data));

  d3.selectAll(".y-axis-line")
    .transition()
    .duration(400)
      .call(d3.axisLeft(yline));
});
}


// update index

function updateIndex() {
d3.csv("data/export2.csv")
  .then((data) => {
        return data.map((d) => {
          d.fecha = parseDate(d.fecha)
          d.total = +d.share_totalindex
          d.nocom = +d.share_nocomindex
          return d;  
        });
        })
  .then(data => {
  datatemp=data;
  yline.domain([40, 150])
        .nice();
  xline.domain(d3.extent(data, d=> d.fecha));

  d3.selectAll(".pathline-total")
    .transition()
    .duration(750)
    .attr("d", drawTotal(data));

  d3.selectAll(".pathline-nocom")
    .transition()
    .duration(750)
    .attr("d", drawNocomb(data));

  d3.selectAll(".y-axis-line")
    .transition()
    .duration(400)
      .call(d3.axisLeft(yline));

});
}


// update fitted

function updateFitted() {
d3.csv("data/export2.csv")
  .then((data) => {
        return data.map((d) => {
          d.fecha = parseDate(d.fecha)
          d.total = +d.share_totalfitted
          d.nocom = +d.share_nocomfitted
          return d;  
        });
        })
  .then(data => {

  yline.domain([40, 150])
        .nice();
  xline.domain(d3.extent(data, d=> d.fecha));

  d3.selectAll(".pathline-total")
  .transition()
  .duration(750)
  .attr("d", drawTotal(data));

  d3.selectAll(".pathline-nocom")
    .transition()
    .duration(750)
    .attr("d", drawNocomb(data));

  d3.selectAll(".y-axis-line")
    .transition()
    .duration(400)
      .call(d3.axisLeft(yline));
});
}

