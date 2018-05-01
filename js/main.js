////////////////////////////////////////////////////////////
//// Process Data //////////////////////////////////////////
////////////////////////////////////////////////////////////
var speedDating = {}; // Namespace
(function() {
  d3.csv("data/speed _dating_data.csv")
    .then(function(csv) {
      var data1 = processDataForDashboard1(csv);
      var data2 = processDataForDashboard2(csv);
      var data3 = processDataForDashboard3(csv);
      speedDating.drawDashboard1(data1);
      speedDating.drawDashboard2(data2);
      speedDating.drawDashboard3(data3);
    });

  ////////////////////////////////////////////////////////////
  //// Dashboard 1 Data //////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function processDataForDashboard1(csv) {
    // Each iid has the same attributes ratings, so it only needs to keep one row for each iid
    var currentiid;
    var data = [];
    csv.forEach(function(row) {
      if (row.iid === currentiid) return; // Ignore this row
      currentiid = row.iid;

      data.push({
        wave: row.wave,
        iid: row.iid,
        gender: row.gender,
        attr_1: row.attr1_1 ? +row.attr1_1 : null,
        sinc_1: row.sinc1_1? +row.sinc1_1 : null,
        intel_1: row.intel1_1 ? +row.intel1_1 : null,
        fun_1: row.fun1_1 ? +row.fun1_1 : null,
        amb_1: row.amb1_1 ? +row.amb1_1 : null,
        shar_1: row.shar1_1 ? +row.shar1_1 : null,
        attr_2: row.attr1_2 ? +row.attr1_2 : null,
        sinc_2: row.sinc1_2 ? +row.sinc1_2 : null,
        intel_2: row.intel1_2 ? +row.intel1_2 : null,
        fun_2: row.fun1_2 ? +row.fun1_2 : null,
        amb_2: row.amb1_2 ? +row.amb1_2 : null,
        shar_2: row.shar1_2 ? +row.shar1_2 : null,
        attr_3: row.attr1_3 ? +row.attr1_3 : null,
        sinc_3: row.sinc1_3 ? +row.sinc1_3 : null,
        intel_3: row.intel1_3 ? +row.intel1_3 : null,
        fun_3: row.fun1_3 ? +row.fun1_3 : null,
        amb_3: row.amb1_3 ? +row.amb1_3 : null,
        shar_3: row.shar1_3 ? +row.shar1_3 : null,
      });
    });
    // console.log(JSON.stringify(data)); // dashboard1-data.json
    return data;
  }

  ////////////////////////////////////////////////////////////
  //// Dashboard 2 Data //////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function processDataForDashboard2(csv) {
    // Each iid has the same imprace and shar1_1, so it only needs to keep one row for each iid
    var currentiid;
    var data = [];
    csv.forEach(function (row) {
      if (row.iid === currentiid) return; // Ignore this row
      currentiid = row.iid;

      data.push({
        wave: row.wave,
        iid: row.iid,
        imprace: row.imprace ? +row.imprace : null,
        shar: row.shar1_1 ? +row.shar1_1 * 10 / 30 : null
      });
    });
    // console.log(JSON.stringify(data)); // dashboard2-data.json
    return data;
  }

  ////////////////////////////////////////////////////////////
  //// Dashboard 3 Data //////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function processDataForDashboard3(csv) {
    var data = [];
    
    csv.forEach(function(row) {
      // Only keep the matched participants
      if (row.match === "0") return;
      // Only use the rows from men, because the rows from women provide identical info
      if (row.gender === "1") return;

      data.push({
        wave: row.wave,
        round: +row.round,
        id: row.iid + "-" + row.pid, // An id to identify each entry
        male: row.iid,
        female: row.pid,
        order: +row.order
      });
    });
    // console.log(JSON.stringify(data)); // dashboard3-data.json
    return data;
  }
})();


