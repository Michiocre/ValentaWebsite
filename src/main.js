var request = window.XMLHttpRequest
  ? new XMLHttpRequest()
  : new ActiveXObject("Microsoft.XMLHTTP");

let values = [];
let selected = 2;
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

      console.log(values);

      if (values.length > 0) {
        changeData();
      }
    });
  });
}

getData();

function next() {
  if (values.length > 0) {
    selected = (selected + 1) % amount;
    changeData();
  }
}

function changeData() {
  document.getElementById('title').innerText = values[selected].ORD_NAME;
  document.getElementById('kunde').innerText = values[selected].KUNDE;
  document.getElementById('nr').innerText = values[selected].ORD_NR;
  document.getElementById('image').src = 'data:image/jpeg;base64,' + values[selected].DOV_CONTENT;
  updateGraph('gesamtzeit', Number(values[selected].GESAMTZEIT), Number(values[selected].GESAMTZEIT_NK));
  updateGraph('sonstiges', Number(values[selected].SONSTIGES), Number(values[selected].SONSTIGES_NK));
  updateGraph('selbstkosten', Number(values[selected].SELBSTKOSTEN), Number(values[selected].SELBSTKOSTEN_NK));
  updateGraph('cgs1', Number(values[selected].CGS1NKSUM), Number(values[selected].CGS1VKSUM));
  updateGraph('cgs2', Number(values[selected].CGS2NKSUM), Number(values[selected].CGS2VKSUM));
  updateGraph('cgs3', Number(values[selected].CGS3NKSUM), Number(values[selected].CGS3VKSUM));
  updateGraph('cgs4', Number(values[selected].CGS4NKSUM), Number(values[selected].CGS4VKSUM));
  updateGraph('cgs5', Number(values[selected].CGS5NKSUM), Number(values[selected].CGS5VKSUM));
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

  document.getElementById(id + 'VK').style.height = timeMapped + '%';
  document.getElementById(id + 'NK').style.height = timeNkMapped + '%';
  document.getElementById(id + 'Change').innerText = (nkIncrease ? '+' + Math.round((timeNkMapped * 100) / timeMapped - 100) + '%' : Math.round(timeNkMapped - timeMapped) + '%');
}

setInterval(next, 10*1000);
