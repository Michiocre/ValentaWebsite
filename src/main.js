var request = window.XMLHttpRequest
  ? new XMLHttpRequest()
  : new ActiveXObject("Microsoft.XMLHTTP");

let values = [];
let selected = 0;
let amount = 0;

function getData() {
  var url = window.location.href.toString() + "data.csv";
  fetch(url).then(function (response) {
    response.text().then(function (text) {
      var lines = text.split("\n");

      amount = lines.length -1;

      let keys = [];

      lines[0].split(";").forEach((value) => {
        if (value.trim() !== '') {
          keys.push(value);
        }
      });

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() !== '') {
          let splits = lines[i].split(";");

          let value = {};

          for (let j = 0; j < splits.length; j++) {
            if (splits[j].trim() !== '') {
              value[keys[j]] = splits[j];
            }
          }

          values.push(value);
        }
      }

      if (values.length > 0) {
        changeData();
  
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);
      }
    });
  });
}



function drawChart() {

  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Hours 1 Planned', Number(values[selected].hours_1_planned)],
    ['Hours 1 Real', Number(values[selected].hours_1_real)],
    ['Hours 2 Planned', Number(values[selected].hours_2_planned)],
    ['Hours 2 Real', Number(values[selected].hours_2_real)],
    ['Hours 3 Planned', Number(values[selected].hours_3_planned)],
    ['Hours 3 Real', Number(values[selected].hours_3_real)],
  ]);

  var options = {
    title: 'My Daily Activities',
    backgroundColor: 'transparent',
    legend: 'none',
    titleTextStyle: {
      color: 'white'
    }
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}

getData();

function next() {
  if (values.length > 0) {
    selected = (selected + 1) % (amount - 1);
    drawChart();
    changeData();
  }
}

function changeData() {
  document.getElementById('title').innerText = values[selected].Ord_Name;
  document.getElementById('title').kunde = values[selected].Kunde;
  document.getElementById('image').src = 'data:image/jpeg;base64,' + values[selected].Bild;
}

setInterval(next, 1*1000);
