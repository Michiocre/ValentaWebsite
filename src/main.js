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
      }
    });
  });
}

getData();

function next() {
  if (values.length > 0) {
    selected = (selected + 1) % (amount - 1);
    changeData();
  }
}

function changeData() {
  document.getElementById('title').innerText = values[selected].ORD_NAME;
  document.getElementById('kunde').innerText = values[selected].KUNDE;
  document.getElementById('nr').innerText = values[selected].ORD_NR;
  document.getElementById('image').src = 'data:image/jpeg;base64,' + values[selected].DOV_CONTENT;
  updateGraph('gesamtzeit', Number(values[selected].GESAMTZEIT), Number(values[selected].GESAMTZEIT) + Number(values[selected].GESAMTZEIT_NK));
}

function updateGraph(id, time, timeNk) {
  nkIncrease = timeNk > time;

  let timeMapped, timeNkMapped;

  if (nkIncrease) {
    timeMapped = (time * 100) / timeNk;
    timeNkMapped = (timeNk * 100) / timeNk;
  } else {
    timeMapped = (time * 100) / time;
    timeNkMapped = (timeNk * 100) / time;
  }

  document.getElementById(id).style.height = timeMapped + '%';
  document.getElementById(id + 'Nk').style.height = timeNkMapped + '%';
  document.getElementById(id + 'Change').innerText = (nkIncrease ? '+' : '') + Math.round(timeNkMapped - timeMapped) + '%';
}

setInterval(next, 10*1000);
