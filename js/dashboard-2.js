speedDating.drawDashboard2 = function(data) {
  ////////////////////////////////////////////////////////////
  //// Initial Setup /////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  var dataAll; // All data points used for rplotting
  var currentSortBy;
  // Dimensions
  var margin = {top: 40, right: 200, bottom: 40, left: 200};
  var width = 1000 - margin.left - margin.right;
  var height = 680 - margin.top - margin.bottom;

  var circleRadius = 60;

  // styles
  var sharColor = "#E0271A";
  var impraceColor = "#C32032";
  var axisStrokeColor = "#000";

  var scoreFormat = d3.format(".1f");

  // Constants
  var series = {
    shar: "Shared Interests",
    imprace: "Racial Lineage"
  };

  // Scales
  var xShar = d3.scaleLinear()
      .range([width / 2, 0]);

  var xImprace = d3.scaleLinear()
      .range([width / 2, width]);

  var y = d3.scaleBand()
      .range([0, height]);

  var yWave = d3.scaleLinear()
      .range([height, 0]);

  var tooltip = d3.select("#tooltip");

  // SVG containers
  var svg = d3.select("#d2-poppyr")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var gIID;

  ////////////////////////////////////////////////////////////
  //// Process Data
  // Filter out any entry that do not have both values
  dataAll = data.filter(function(d) {
    return d.imprace && d.shar;
  });

  var sharMax = 10;
  var impraceMax = 10;

  xShar.domain([0, sharMax]);
  xImprace.domain([0, impraceMax]);
  y.domain(dataAll.map(function(d) { return d.iid; }));  
  yWave.domain([0, dataAll.length]);

  // Find number of people in each wave for wave axis
  var peopleByWaves = d3.nest()
      .key(function(d) {
        return d.wave;
      })
      .rollup(function(leaves) {
        return leaves.length;
      })
      .entries(dataAll);

  var accValue = 0;
  var cumulatedPeopleByWaves = peopleByWaves.reduce(function(acc, wave) {
    accValue += wave.value;
    acc.push({
      wave: wave.key,
      value: wave.value,
      accValue: accValue
    });
    return acc;
  }, []);

  ////////////////////////////////////////////////////////////
  //// Population Pyramid ////////////////////////////////////
  ////////////////////////////////////////////////////////////
  setupPopPyr();
  sortBy("shar");

  function setupPopPyr() {
    // Draw Bottom Axes
    var axisShare = d3.axisBottom(xShar);
    var axisImprace = d3.axisBottom(xImprace);

    g.append("g")
        .attr("class", "axis axis-x-shar")
        .attr("transform", "translate(0," + height + ")")
        .call(axisShare);

    g.append("g")
        .attr("class", "axis axis-x-imprace")
        .attr("transform", "translate(0," + height + ")")
        .call(axisImprace);
    
    // Extend the bottom axis line to edges
    g.append("line")
      .attr("class", "axis axis-x")
      .attr("x1", -margin.left)
      .attr("x2", width + margin.right)
      .attr("y1", height)
      .attr("y2", height)
      .style("stroke", axisStrokeColor)

    // Draw left wave axis
    var tickValues = cumulatedPeopleByWaves.map(function(d) { return d.accValue; })
    var axisLeftWave = d3.axisRight(yWave)
      .tickValues(tickValues)
      .tickFormat(function(d, i) {
        return cumulatedPeopleByWaves[i].wave;
      });
    var axisRightWave = d3.axisLeft(yWave)
      .tickValues(tickValues)
      .tickFormat(function (d, i) {
        return cumulatedPeopleByWaves[i].wave;
      });

    g.append("g")
        .attr("class", "axis axis-y-left")
        .attr("transform", "translate(" + (-margin.left + 0.5) + ",0)")
        .call(axisLeftWave);

    g.append("g")
      .attr("class", "axis axis-y-right")
      .attr("transform", "translate(" + (width + margin.right - 1.5) + ",0)")
      .call(axisRightWave);

    // Draw right wave axis

    // Add sorting control circles
    var controlShar = g.append("g")
        .attr("transform", "translate(" + (-margin.left / 2) + "," + 60 + ")");

    controlShar.append("foreignObject")
        .attr("class", "foreignobj")
        .attr("x", -circleRadius)
        .attr("y", -circleRadius)
        .attr("width", 2 * circleRadius)
        .attr("height", 2 * circleRadius)
      .append("xhtml:div")
        .style("width", 2 * circleRadius + "px")
        .style("height", 2 * circleRadius + "px")
        .html("<div>Shared</div><div>Interests</div>");

    var controlSharText = controlShar.append("circle")
        .attr("r", circleRadius)
        .style("fill", "none")
        .style("stroke", "#000")
        .style("pointer-events", "all")
        .style("cursor", "pointer")
        .on("mouseover", function () {
          controlSharText.html("<div>Sort By</div><div>This</div>");
        })
        .on("mouseout", function () {
          controlSharText.html("<div>Shared</div><div>Interests</div>");
        })
        .on("click", function () {
          sortBy("shar");
        });

    var controlImprace = g.append("g")
      .attr("transform", "translate(" + (width + margin.right / 2) + "," + 60 + ")");

    var controlImpraceText = controlImprace.append("foreignObject")
        .attr("class", "foreignobj")
        .attr("x", -circleRadius)
        .attr("y", -circleRadius)
        .attr("width", 2 * circleRadius)
        .attr("height", 2 * circleRadius)
      .append("xhtml:div")
        .style("width", 2 * circleRadius + "px")
        .style("height", 2 * circleRadius + "px")
        .html("<div>Racial</div><div>Lineage</div>");

    controlImprace.append("circle")
        .attr("r", circleRadius)
        .style("fill", "none")
        .style("stroke", "#000")
        .style("pointer-events", "all")
        .style("cursor", "pointer")
        .on("mouseover", function () {
          controlImpraceText.html("<div>Sort By</div><div>This</div>");
        })
        .on("mouseout", function () {
          controlImpraceText.html("<div>Racial</div><div>Lineage</div>");
        })
        .on("click", function () {
          sortBy("imprace");
        });

    // Draw population pyramid
    gIID = g.selectAll("g.iid-container")
      .data(dataAll, function (d) {
        return d.iid;
      })
      .enter().append("g")
        .attr("class", "iid-container")
        .attr("transform", function(d) {
          return "translate(0," + y(d.iid) + ")";
        });

    // Shared interests rect
    gIID.append("rect")
      .attr("class", "shar")
      .style("fill", sharColor)
      .attr("x", function (d) {
        return xShar(d.shar);
      })
      .attr("height", y.bandwidth())
      .attr("width", function (d) {
        return xShar(0) - xShar(d.shar);
      });

    // Racial lineage rect
    gIID.append("rect")
      .attr("class", "imprace")
      .attr("height", y.bandwidth())
      .style("fill", impraceColor)
      .attr("x", xImprace(0))
      .attr("width", function (d) {
        return xImprace(d.imprace) - xImprace(0);
      });

    // Outline rect
    gIID.append("rect")
        .attr("class", "outline")
        .style("fill", "none")
        .style("fill-opacity", 0.7)
        .style("pointer-events", "all")
        .attr("x", function (d) {
          return xShar(d.shar);
        })
        .attr("height", y.bandwidth())
        .attr("width", function (d) {
          return xShar(0) - xShar(d.shar) + xImprace(d.imprace) - xImprace(0);
        })
        .on("mouseover", function() {
          d3.select(this).style("fill", "#000");
          showTooltip();
        })
        .on("mousemove", function(d) {
          var wave = d.wave;
          var shar = d.shar;
          var imprace = d.imprace;
          var html = "<div>Wave " + wave + "</div>" +
            "<div>Shared Interests: " + scoreFormat(shar) + "</div>" +
            "<div>Racial Lineage: " + scoreFormat(imprace) + "</div>";
          updateTooltip(html);
        })
        .on("mouseout", function() {
          d3.select(this).style("fill", "none");
          hideTooltip();
        });
  }

  function sortBy(field) {
    if (currentSortBy === field) return;
    currentSortBy = field;
    // Sort the data
    if (field === "shar") {
      dataAll.sort(function (a, b) {
        return b.wave - a.wave || a.shar - b.shar || a.imprace - b.imprace;
      });
    } else if (field === "imprace") {
      dataAll.sort(function (a, b) {
        return b.wave - a.wave || a.imprace - b.imprace || a.shar - b.shar;
      });
    }
    
    // Update the population pyramid
    y.domain(dataAll.map(function (d) { return d.iid; }));  

    gIID
      .transition()
      .duration(2000)
      .attr("transform", function (d) {
        return "translate(0," + y(d.iid) + ")";
      });

  }

  ////////////////////////////////////////////////////////////
  //// Tooltip ///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function showTooltip() {
    tooltip.transition()
      .style("opacity", 1);
  }

  function hideTooltip() {
    tooltip.transition()
      .style("opacity", 0);
  }

  function updateTooltip(html) {
    var bbox = tooltip.node().getBoundingClientRect();
    var tooltipHeight = bbox.height;
    var tooltipWidth = bbox.width;
    tooltip
      .style("top", d3.event.pageY - tooltipHeight - 10 + "px")
      .style("left", d3.event.pageX - tooltipWidth / 2 + "px")
      .html(html);
  }
};