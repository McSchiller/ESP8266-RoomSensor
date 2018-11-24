var dataSeries = new Array();
var hours = 1;
$(function () {
	for (var i=1; i <= 5; i++)
	{
		$.ajax({
			url: 'valuesTemp.php',
			type: 'GET',
			async: false,
			data: {sensorID:i, hours:hours},
			success: buildDataSeries
		});
	}
	hc();
});

function getData(){
    hours = document.getElementById('hours').value;
	dataSeries = new Array();
	for (var i=1; i <= 5; i++)
	{
		$.ajax({
			url: 'valuesTemp.php',
			type: 'GET',
			async: false,
			data: {sensorID:i, hours:hours},
			success: buildDataSeries
		});
	}
	hc();
}

function buildDataSeries(data)
{
	var xyPairs = [];
	var x_value = Date.UTC(1970, 10, 25);
	var y_value = 20.0;
	var switch1 = true;
	data = data.split('/');
	for (var i in data)
	{
		if (switch1 == true)
		{
			var x_value = timeConverter(data[i]);
			//document.write(x_value);
			switch1 = false;
		}
		else
		{
			y_value = parseFloat(data[i]);
			switch1 = true;
			xyPairs.push([x_value, y_value]);
		}
	}
	dataSeries.push(xyPairs);
}

function hc()
{
	var myChart = Highcharts.chart('container', {
	chart: {
		type: 'spline',
		zoomType: 'x'
	},
	title: {
		text: 'ESP8266 Temperature'
	},
	xAxis : {
			type: 'datetime',
			title : {text : 'Time'},
			ordinal: false
	},
	yAxis : {
			title : {text : 'Temperature'},
			floor: 15.0,
			ceiling: 30.0
	},
	series: [{
		name : 'Küche',
		data : dataSeries[0]
	},{
		name : 'Wohnzimmer',
		data : dataSeries[1]
	},{
		name : 'Schlafzimmer',
		data : dataSeries[2]
	},{
		name : 'Bad',
		data : dataSeries[3]
	},{
		name : 'Balkon',
		data : dataSeries[4]
	}]
});
}


function timeConverter(UNIX_timestamp){
  //document.write(UNIX_timestamp);
  var a = new Date(UNIX_timestamp * 1000);
  //document.write(a);
  var year = a.getFullYear();
  var month = a.getMonth();
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return Date.UTC(year, month, date, hour, min, sec);
}