speedDating.drawDashboard3 = function (data) {
  ////////////////////////////////////////////////////////////
  //// Initial Setup /////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  var dataAll; // Nested data with wave as the key
  var dataWave; // Current wave data
  var currentWave = 1;

  // Dimensions
  var marginRight = 100;
  var width = 700 + marginRight;
  var height = 660;
  var gridSize = 30; // The side of one grid
  var legendItemSize = 30;
  var legendCircleRadius = 10;

  // Styles
  var gridLineStrokeColor = "#000";
  var gridFillColors = ["#0571b0", "#92c5de", "#ffffbf", "#f4a582", "#ca0020"];

  // Scales
  var x = d3.scaleBand();
  var y = d3.scaleBand();

  var colorDomains = [0.2, 0.4, 0.6, 0.8];
  var color = d3.scaleThreshold()
      .domain(colorDomains)
      .range(gridFillColors);

  var tooltip = d3.select("#tooltip");

  // SVG containers
  var svg = d3.select("#d3-heatmap")
    .append("svg")
      .attr("width", width)
      .attr("height", height);

  var g = svg.append("g")
      .attr("class", "heatmap-chart")
      .attr("transform", "translate(" + (width - marginRight) / 2 + "," + height / 2 + ")");

  ////////////////////////////////////////////////////////////
  //// Process Data
  // Convert to a nested data structure with wave as the key
  dataAll = d3.nest()
    .key(function (d) {
      return d.wave;
    })
    .map(data);
  dataWave = dataAll.get(currentWave);

  ////////////////////////////////////////////////////////////
  //// Setup Dropdown
  var allWaves = dataAll.keys();
  allWaves.unshift(1);
  var customSelect = d3.select("#d3-wave")
    .style("left", "700px")
    .style("top", "40px");
  customSelect.append("select")
    .selectAll("option")
    .data(allWaves).enter()
    .append("option")
    .attr("value", function (d) { return d; })
    .text(function (d) {
      return "Wave " + d;
    });
  addCustomSelect("d3-wave");
  customSelect.select(".select-items")
    .selectAll("div")
    .on("click.change", function () {
      currentWave = this.innerHTML.split(" ")[1];
      dataWave = dataAll.get(currentWave);
      updateHeatmap();
    });

  ////////////////////////////////////////////////////////////
  //// Legend
  var legendG = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (width - marginRight) + ",250)");

  // Legend title
  legendG.append("text")
      .attr("x", marginRight / 2)
      .attr("y", -20)
      .style("fill", "#000")
      .style("text-anchor", "middle")
      .text("Date Order Number");

  var legendColors = ["#fff"].concat(gridFillColors);

  var legendItemG = legendG
    .selectAll(".legend-item-g")
    .data(legendColors)
    .enter().append("g")
      .attr("class", "legend-item-g")
      .attr("transform", function(d, i) {
        return "translate(20," + (i + 0.5) * legendItemSize + ")";
      })
      .on("mouseover", function(d, i) {
        if (i === 0) return;
        var grid = d3.selectAll(".grid");
        grid.filter(function(e) {
          return e.colorIndex !== (i - 1);
        }).style("fill", "#eee");
      })
      .on("mouseout", function(d, i) {
        if (i === 0) return; 
        d3.selectAll(".grid")
          .style("fill", function(e) {
            return e.color;
          });
      });

  legendItemG.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", legendCircleRadius)
      .style("fill", function(d) {
        return d;
      })
      .style("stroke", gridLineStrokeColor);

  var lengendText = legendItemG.append("text")
      .attr("x", legendCircleRadius * 3)
      .attr("y", 0)
      .style("dominant-baseline", "middle")
      .style("fill", "#000");

  ////////////////////////////////////////////////////////////
  //// Render
  updateHeatmap();

  ////////////////////////////////////////////////////////////
  //// Heatmap ////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function updateHeatmap() {
    var maxOrder = dataWave[0].round;
    var maleIIDs = d3.set(dataWave, function(d) { return d.male; }).values();
    var femaleIIDs = d3.set(dataWave, function (d) { return d.female; }).values().sort(d3.ascending);
     
    // Rows are males
    var numRows = maleIIDs.length;
    // Columns are females
    var numCols = femaleIIDs.length;

    var heatmapWidth = numCols * gridSize;
    var heatmapHeight = numRows * gridSize;

    // Update scales
    x.domain(femaleIIDs)
      .range([-heatmapWidth / 2, heatmapWidth / 2]);

    y.domain(maleIIDs)
      .range([-heatmapHeight / 2, heatmapHeight / 2]);

    // Update legend text
    lengendText.text(function(d, i) {
      if (i === 0) return "No Match";

      var min, max;
      // Find the min number for each lengend item
      if (i === 1) {
        min = 1;
      } else {
        min = Math.floor(colorDomains[i - 2] * maxOrder) + 1;
      }
      // Find the max number for each lengend item
      if (i === legendColors.length - 1) {
        max = maxOrder;
      } else {
        max = Math.floor(colorDomains[i - 1] * maxOrder);
      }

      // If min = max, then only shows one number
      if (min === max) {
        return min;
      } else {
        return min + " - " + max;
      }
    });

    // Add grids
    var grid = g.selectAll(".grid")
      .data(dataWave, function (d) { return d.id; });

    var gridExit = grid.exit().remove();

    var gridEnter = grid.enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.female);
      })
      .attr("y", function (d) {
        return y(d.male);
      })
      .attr("width", 0)
      .attr("height", gridSize)
      .style("fill", function (d) {
        var percentage = d.order / maxOrder;

        var index = colorDomains.indexOf(percentage);
        if ( index !== -1) {
          percentage -= 0.001
        }
        d.color = color(percentage)
        d.colorIndex = gridFillColors.indexOf(d.color);
        return d.color;
      })
      .attr("class", function(d) {
        return "grid grid-" + d.colorIndex;
      })
      .on("mouseover", showTooltip)
      .on("mousemove", function (d) {
        var html = "<div>Date Order: " + d.order + "</div>";
        updateTooltip(html);
      })
      .on("mouseout", hideTooltip)
      .transition()
      .duration(200)
      .delay(function(d) {
        return d.colorIndex * 200;
      })
      .attr("width", gridSize);

    // Add foreground grids
    g.select(".bg-grid").remove();

    var bgGrid = g.append("g")
      .attr("class", "bg-grid")
      .attr("transform", "translate(" + (-heatmapWidth / 2) + "," + (-heatmapHeight / 2) + ")");

    bgGrid.selectAll(".bg-row")
      .data(d3.range(numRows + 1))
      .enter().append("line")
      .attr("x1", 0)
      .attr("x2", heatmapWidth)
      .attr("y1", function (d) {
        return d * gridSize;
      })
      .attr("y2", function (d) {
        return d * gridSize;
      })
      .style("stroke", gridLineStrokeColor);

    bgGrid.selectAll(".bg-col")
      .data(d3.range(numCols + 1))
      .enter().append("line")
      .attr("x1", function (d) {
        return d * gridSize;
      })
      .attr("x2", function (d) {
        return d * gridSize;
      })
      .attr("y1", 0)
      .attr("y2", heatmapHeight)
      .style("stroke", gridLineStrokeColor);
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