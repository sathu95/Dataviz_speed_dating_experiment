speedDating.drawDashboard1 = function(data) {
  ////////////////////////////////////////////////////////////
  //// Initial Setup /////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  var dataAll; // Nested data with wave as the key
  var dataWave; // Current wave data
  var currentWave = 1;

  // Dimensions
  var widthPicto = 500;
  var heightPicto = 400;
  var marginPictoTop = 85;

  var widthRadar = 600;
  var heightRadar = 600;
  var radiusRadar = Math.min(widthRadar, heightRadar) / 4;
  var radiusLevelLine = radiusRadar * 0.8;

  var widthBar = 600;
  var heightBar = 340;
  var marginBarBottom = 40;

  // Styles
  var attributeColors = ["#66c2a5", "#fc8d62", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"];
  var genderColors = ["#e78ac3", "#8da0cb"];

  var radarAreaOpacity = 0.4;
  var strokeWidth = 2;
  var radarDotRadius = 5;

  // Constants
  var attributes = {
    attr: "Attractive",
    sinc: "Sincere",
    intel: "Intelligent",
    fun: "Fun",
    amb: "Ambitious",
    shar: "Shared Hobbies"
  };
  var genders = {
    0: "Female",
    1: "Male"
  };
  var times = {
    _1: "During sign up",
    _2: "After the event",
    _3: "3-4 weeks after matches were sent"
  };

  var duration = 750; // Animation duration

  // Picto constants
  var maleBodyPath = "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21   c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31   s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13   V154h10V476z";
  var maleHeadPath = "M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42   c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z";
  var femaleBodyPath = "M462.5,323l-60-166c-0.667-0.667-1-1.333-1-2c0-3.333,1.667-5,5-5c2,0,3.333,1.333,4,4l41,107   c3.337,7.333,10.67,11,22,11c4,0,6.833-3,8.5-9s2.5-10,2.5-12l-42-103c-1.333-12.667-7.333-23.333-18-32s-23-13-37-13h-53   c-14,0-26.5,4.5-37.5,13.5S279.5,136,277.5,148l-39,104c-1.333,2-1,5.833,1,11.5s5,8.5,9,8.5c12.667,0,20-3.333,22-10l40-108   c0.667-2,2-3,4-3c2.667,0,4,1.333,4,4v1l-59,167v13c0,1.334,1.667,3.668,5,7c3.338,3.333,5.671,5,7,5h38v129   c0,5.333,2.167,10,6.5,14c4.336,4,9.169,6,14.5,6c5.333,0,10-2,14-6s6-8.667,6-14V343c0-0.667,1.833-1.167,5.5-1.5   s7.167-0.333,10.5,0c3.333,0.337,5,0.837,5,1.5v133c0,5.333,2,10.167,6,14.5s8.833,6.5,14.5,6.5s10.5-2.167,14.5-6.5   s6-9.167,6-14.5V348h39c2,0,4.333-1.667,7-5s4-5.667,4-7v-3v-4v-4V323z";
  var femaleHeadPath = "M317.5,42.5c0,11.667,4.167,21.667,12.5,30S348.333,85,360,85s21.667-4.167,30-12.5   s12.5-18.333,12.5-30s-4.167-21.667-12.5-30S371.667,0,360,0s-21.667,4.167-30,12.5S317.5,30.833,317.5,42.5z";

  // Radar constants
  var rMaxValue = 50;
  var rLevels = 5;
  var axisNames = Object.keys(attributes);
  var axisTotal = axisNames.length;
  var angleSlice = Math.PI * 2 / axisTotal;

  // Scales
  var colorAttributeScale = d3.scaleOrdinal()
    .range(attributeColors)
    .domain(Object.keys(attributes));

  var colorGenderScale = d3.scaleOrdinal()
    .range(genderColors)
    .domain(Object.keys(genders));

  var xPicto = d3.scaleBand()
    .domain(Object.values(genders))
    .range([0, widthPicto]);
    
  var yPicto = d3.scaleLinear()
    .domain([0, 100])
    .range([heightPicto, marginPictoTop]);

  var rRadar = d3.scaleLinear()
    .range([0, radiusLevelLine])
    .domain([0, rMaxValue]);

  var x0Bar = d3.scaleBand()
    .domain(Object.keys(attributes))
    .range([0, widthBar])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  var x1Bar = d3.scaleBand()
    .domain(Object.keys(genders))
    .range([0, x0Bar.bandwidth()])
    .padding(0.1);

  var yBar = d3.scaleLinear()
    .domain([0, rMaxValue])
    .range([heightBar - marginBarBottom, 0]);

  // Other variables
  var stack = d3.stack()
    .keys(Object.keys(attributes).reverse())
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  var radarLine = d3.lineRadial()
    .curve(d3.curveCardinalClosed)
    .radius(function(d) { return rRadar(d.value); })
    .angle(function(d, i) { return i * angleSlice; });

  var scoreFormat = d3.format(".1f");

  var tooltip = d3.select("#tooltip");

  // SVG containers
  var svgPico = d3.select("#d1-picto")
    .append("svg")
      .attr("width", widthPicto)
      .attr("height", heightPicto);

  var gPico = svgPico.append("g")
    .attr("clip-path", "url(#clip)");

  var svgRadar = d3.select("#d1-radar")
      .style("left", widthPicto + "px")
      .style("top", 100 + "px")
    .append("svg")
      .attr("width", widthRadar)
      .attr("height", heightRadar);

  var gRadar = svgRadar.selectAll(".radar-chart")
    .data(Object.keys(times))
    .enter().append("g")
    .attr("class", "radar-chart")
    .attr("transform", function (d) {
      var x, y;
      switch (d) {
        case "_1":
          x = radiusRadar;
          y = radiusRadar;
          break;
        case "_2":
          x = widthRadar / 2 + radiusRadar;
          y = radiusRadar;
          break;
        case "_3":
          x = widthRadar / 2;
          y = heightRadar / 2 + radiusRadar;
          break;
        default:
          break;
      }
      return "translate(" + x + "," + y + ")";
    });

  var svgBar = d3.select("#d1-bar")
    .style("top", heightPicto + "px")
    .append("svg")
    .attr("width", widthBar)
    .attr("height", heightBar);

  // Add defs clipPath for pictogram
  // Body as clipPath
  var defs = svgPico.append("defs");
  var clipPath = defs.append("clipPath")
    .attr("id", "clip");
  clipPath.append("path")
    .attr("d", femaleBodyPath)
    .attr("transform", "scale(0.8)translate(-175,4)");
  clipPath.append("path")
    .attr("d", maleBodyPath)
    .attr("transform", "scale(0.8)translate(355,4)");

  // Head as normal paths
  var gHead = svgPico.append("g")
    .attr("class", "head");

  gHead.append("path")
    .attr("d", femaleHeadPath)
    .attr("transform", "scale(0.8)translate(-175,4)");

  gHead.append("path")
    .attr("d", maleHeadPath)
    .attr("transform", "scale(0.8)translate(355,4)");

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
  var customSelect = d3.select("#d1-wave")
      .style("left", "1000px")
      .style("top", "40px");
  customSelect.append("select")
    .selectAll("option")
    .data(allWaves).enter()
      .append("option")
      .attr("value", function(d) { return d; })
      .text(function(d) {
        return "Wave " + d;
      });
  addCustomSelect("d1-wave");
  customSelect.select(".select-items")
      .selectAll("div")
      .on("click.change", function() {
        currentWave = this.innerHTML.split(" ")[1];
        dataWave = dataAll.get(currentWave);
        updatePicto();
        updateRadar();
        updateBar();
      });

  ////////////////////////////////////////////////////////////
  //// Legend
  var widthLegend = 120;
  var legendItemHeight = 30;
  var legendItems = Object.keys(genders).concat("", Object.keys(attributes));
  var heightLegend = legendItems.length * legendItemHeight;
  var legendRectSize = 16;
  var gLegend = d3.select("#d1-legend")
      .style("left", "980px")
      .style("top", "420px")
    .append("svg")
      .attr("width", widthLegend)
      .attr("height", heightLegend);

  var gLegnedItem = gLegend.selectAll("g")
      .data(legendItems)
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + (i + 0.5) * legendItemHeight + ")"; 
      });
  
  gLegnedItem.append("rect")
      .attr("x", 0)
      .attr("y", -legendRectSize / 2)
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .style("fill", function(d, i) {
        if (i < Object.keys(genders).length) {
          return colorGenderScale(d);
        } else if (i === Object.keys(genders).length) {
          return "none"
        } else {
          return colorAttributeScale(d);
        }
      });
  
  gLegnedItem.append("text")
      .attr("x", legendRectSize * 2)
      .attr("alignment-baseline", "middle")
      .text(function(d, i) {
        if (i < Object.keys(genders).length) {
          return genders[d];
        } else if (i === Object.keys(genders).length) {
          return;
        } else {
          return attributes[d];
        }
      });


  ////////////////////////////////////////////////////////////
  //// Render
  updatePicto();
  setupRadar();
  updateRadar();
  setupBar();
  updateBar();

  ////////////////////////////////////////////////////////////
  //// Pictogram /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function updatePicto() {
    // Update the data
    var dataWaveGender = d3.nest()
      .key(function(d) {
        return d.gender;
      })
      .rollup(function(leaves) {
        var values = {};
        Object.keys(attributes).forEach(function (d) {
          var sum = 0;
          var count = 0;
          leaves.forEach(function (leaf) {
            Object.keys(times).forEach(function (e) {
              if (leaf[d + e] !== null) {
                sum += leaf[d + e];
                count += 1;
              }
            });
          });
          values[d] = sum / count;
        });
        values.gender = genders[leaves[0].gender];
        return values;
      })
      .entries(dataWave);

    var g = gPico.selectAll("g")
      .data(stack(dataWaveGender.map(function(d) {
        return d.value;
      })));

    g = g.enter().append("g")
      .style("fill", function (d, i) {
        return colorAttributeScale(d.key);
      })
      .merge(g)
      
      
    var rect = g.selectAll("rect")
      .data(function(d) { return d; });

    rect.enter().append("rect")
        .attr("x", function(d) {
          return xPicto(d.data.gender);
        })
        .attr("width", xPicto.bandwidth())
        .attr("y", function (d) {
          return yPicto(d[1]);
        })
        .attr("height", function (d) {
          return yPicto(d[0]) - yPicto(d[1]);
        })
        .on("mouseover", showTooltip)
        .on("mousemove", function(d) {
          var gender = d.data.gender;
          var attributeKey = d3.select(this.parentNode).datum().key;
          var attributeName = attributes[attributeKey];
          var score = d.data[attributeKey];
          var html = "<div>" + gender + "</div>" +
            "<div>" + attributeName + "</div>" +
            "<div>" + scoreFormat(score) + "</div>";
          updateTooltip(html);
        })
        .on("mouseout", hideTooltip)
      .merge(rect)
        .transition()
        .duration(duration)
        .attr("y", function(d) {
          return yPicto(d[1]);
        })
        .attr("height", function(d) {
          return yPicto(d[0]) - yPicto(d[1]);
        });
  }


  ////////////////////////////////////////////////////////////
  //// Radar Chart ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function setupRadar() {
    // Draw levels
    var levelValues = d3.range(1, rLevels + 1).reverse()
      .map(function(d) {
        return rMaxValue / rLevels * d;
      })
    var gLevel = gRadar.append("g").attr("class", "level-wrapper");

    gLevel.selectAll("circle")
      .data(levelValues)
      .enter().append("circle")
      .attr("class", "level-line")
      .attr("r", function(d) { return rRadar(d); })
      .style("fill", "none");

    gLevel.selectAll("text")
      .data(levelValues)
      .enter().append("text")
      .attr("class", "level-value")
      .attr("x", 6)
      .attr("y", function (d) { return -rRadar(d); })
      .attr("dy", "0.35em")
      .text(function(d) { return d; })

    // Draw Axes
    var gAxis = gRadar.append("g").attr("class", "axis-wrapper");

    var axis = gAxis.selectAll(".axis")
      .data(axisNames)
      .enter().append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("class", "axis-line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function (d, i) { return rRadar(rMaxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y2", function (d, i) { return rRadar(rMaxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
      .style("stroke-width", strokeWidth)
      .style("stroke", function(d, i) { return attributeColors[i] });

    // Draw titles
    svgRadar.selectAll(".radar-chart")
      .data(Object.keys(times))
      .append("text")
        .attr("class", "radar-title")
        .attr("y", -radiusLevelLine * 1.2)
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .text(function(d) {
          return times[d];
        })

    gRadar.append("g")
      .attr("class", "all-blobs-wrapper");

  }
  function updateRadar() {
    // Update the data
    var dataWaveTime = Object.keys(times).map(function(d) {
      var value = d3.nest()
        .key(function (d) {
          return d.gender;
        })
        .rollup(function (leaves) {
          var values = [];
          Object.keys(attributes).forEach(function (e) {
            var sum = 0;
            var count = 0;
            leaves.forEach(function (leaf) {
              if (leaf[e + d] !== null) {
                sum += leaf[e + d];
                count += 1;
              }
            });
            values.push({
              axis: e,
              value: sum / count
            });
          });
          values.gender = genders[leaves[0].gender];
          return values;
        })
        .entries(dataWave);
      return { 
        time: d, 
        value: value
      }
    });

    var gBlob = svgRadar.selectAll(".radar-chart")
      .data(dataWaveTime)
      .select(".all-blobs-wrapper")
      .selectAll(".blob-wrapper")
      .data(function (d) { return d.value; });

    var gBlobEnter = gBlob
      .enter().append("g")
      .attr("class", function(d) {
        return "blob-wrapper blob-wrapper-" + d.key;
      });

    // Draw blob areas
    var blobArea = gBlobEnter.append("path")
      .attr("class", function(d) {
        return "blob-area blob-area-" + d.key;
      })
      .style("fill", function(d) {
        return colorGenderScale(d.key);
      })
      .style("fill-opacity", radarAreaOpacity)
      .style("stroke", function (d) {
        return colorGenderScale(d.key);
      })
      .style("stroke-width", strokeWidth)
      .style("pointer-events", "none")
      .merge(gBlob.select(".blob-area"));
      
    blobArea.transition()
      .duration(duration)
      .attr("d", function(d) { return radarLine(d.value); });

    // Draw blob circles
    var gCircle = gBlobEnter.merge(gBlob)
      .selectAll(".circle-wrapper")
      .data(function(d) {
        return d.value.map(function(e) {
          e.key = d.key;
          return e;
        });
      });

    var gCircleEnter = gCircle
      .enter().append("g")
      .attr("class", function(d) {
        return "circle-wrapper circle-wrapper-" + d.key;
      });

    gCircleEnter
      .attr("transform", function (d, i) {
        return "translate(" +
          rRadar(d.value) * Math.cos(angleSlice * i - Math.PI / 2) + "," +
          rRadar(d.value) * Math.sin(angleSlice * i - Math.PI / 2) + ")";
      })
    .merge(gCircle)
      .transition()
      .duration(duration)
      .attr("transform", function(d, i) {
        return "translate(" + 
          rRadar(d.value) * Math.cos(angleSlice * i - Math.PI / 2) + "," +
          rRadar(d.value) * Math.sin(angleSlice * i - Math.PI / 2) + ")";
      });

    gCircleEnter.append("circle")
      .attr("class", function(d) {
        return "circle circle-" + d.key;
      })
      .attr("r", radarDotRadius)
      .style("fill", function (d) {
        return colorGenderScale(d.key);
      })
      .on("mouseover", function(d) {
        // Bring current blob wrapper to the front
        blobArea
          .style("fill-opacity", 0.1)
          .style("stroke-opacity", 0.3);
        blobArea.filter(function(e) {
          return e.key === d.key
        }).style("fill-opacity", radarAreaOpacity)
          .style("stroke-opacity", 1);
        showTooltip();
      })
      .on("mousemove", function (d) {
        var gender = genders[d.key];
        var attributeKey = d.axis;
        var attributeName = attributes[attributeKey];
        var score = d.value;
        var html = "<div>" + gender + "</div>" +
          "<div>" + attributeName + "</div>" +
          "<div>" + scoreFormat(score) + "</div>";
        updateTooltip(html);
      })
      .on("mouseout", function() {
        blobArea
          .style("fill-opacity", radarAreaOpacity)
          .style("stroke-opacity", 1);
        hideTooltip();
      });
  }
  

  ////////////////////////////////////////////////////////////
  //// Bar Chart /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function setupBar() {
    var xAxis = d3.axisBottom(x0Bar)
      .tickSizeInner(0)
      .tickSizeOuter(0)
      .tickFormat(function(d) {
        return attributes[d];
      });
    
    // Draw x axis
    var gXAxis = svgBar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (heightBar - marginBarBottom) + ")");

    gXAxis.selectAll("rect")
      .data(Object.keys(attributes))
      .enter().append("rect")
      .attr("transform", function (d) {
        return "translate(" + x0Bar(d) + ")";
      })
      .attr("width", x0Bar.bandwidth())
      .attr("height", "1.5em")
      .style("opacity", 0.8)
      .style("fill", function(d) {
        return colorAttributeScale(d);
      });

    gXAxis.call(xAxis);

    // Draw levels
    var levelValues = d3.range(1, rLevels).reverse()
      .map(function (d) {
        return rMaxValue / rLevels * d;
      })
    var gLevel = svgBar.append("g").attr("class", "level-wrapper");

    gLevel.selectAll("line")
      .data(levelValues)
      .enter().append("line")
      .attr("class", "level-line")
      .attr("x1", 0)
      .attr("y1", function(d) { return yBar(d); })
      .attr("x2", widthBar)
      .attr("y2", function (d) { return yBar(d); });

    gLevel.selectAll("text")
      .data(levelValues)
      .enter().append("text")
      .attr("class", "level-value")
      .attr("x", 6)
      .attr("y", function (d) { return yBar(d); })
      .text(function (d) { return d; })

    // Bar group container
    svgBar.selectAll(".bar-group")
      .data(Object.keys(attributes))
      .enter().append("g")
      .attr("class", "bar-group")
      .attr("transform", function (d) {
        return "translate(" + x0Bar(d) + ")";
      });
  }

  function updateBar() {
    // Update the data
    var dataWaveAttributes = Object.keys(attributes).map(function (d) {
      var value = d3.nest()
        .key(function (d) {
          return d.gender;
        })
        .rollup(function (leaves) {
          var sum = 0;
          var count = 0;
          Object.keys(times).forEach(function (e) {
            leaves.forEach(function (leaf) {
              if (leaf[d + e] !== null) {
                sum += leaf[d + e];
                count += 1;
              }
            });
          });
          return sum / count;
        })
        .entries(dataWave);
      return {
        attribute: d,
        value: value
      }
    });

    var bar = svgBar.selectAll(".bar-group")
      .data(dataWaveAttributes)
      .selectAll(".bar")
      .data(function(d) {
        return d.value;
      });

    bar.enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x1Bar(d.key);
      })
      .attr("y", heightBar - marginBarBottom)
      .attr("width", x1Bar.bandwidth())
      .attr("height", 0)
      .style("fill", function(d, i) {
        return genderColors[i];
      })
      .on("mouseover", showTooltip)
      .on("mousemove", function (d) {
        var gender = genders[d.key];
        var attributeKey = d3.select(this.parentNode).datum().attribute;
        var attributeName = attributes[attributeKey];
        var score = d.value;
        var html = "<div>" + gender + "</div>" +
          "<div>" + attributeName + "</div>" +
          "<div>" + scoreFormat(score) + "</div>";
        updateTooltip(html);
      })
      .on("mouseout", hideTooltip)
    .merge(bar)
      .transition()
      .duration(duration)
      .attr("y", function(d) {
        return yBar(d.value);
      })
      .attr("height", function(d) {
        return heightBar - marginBarBottom - yBar(d.value);
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
      .style("left", d3.event.pageX  - tooltipWidth / 2 + "px")
      .html(html);
  }
};