var public_key = 'pw3V5x60GDu56ERLQg7w';

var TIMESTAMP_KEY = 'timestamp';

$('.sparkfun-link').text('Phant Stream: ' + public_key);
$('.sparkfun-link').attr('href', 'https://data.sparkfun.com/streams/' + public_key);

$.ajax({
  url: 'http://data.sparkfun.com/output/' + public_key + '.json',
  jsonp: 'callback',
  dataType: 'jsonp',
  data: 'gt[timestamp]=now%20-1day',
  success: function(data) {
    $('.loading').hide();
    $('.done-loading').show();

    data = _.sortBy(data, function(point) { return new Date(point[TIMESTAMP_KEY]); });
    keys = _.keys(_.first(data));
    keys.pop();

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      var row = $('<div class="row">');
      var col = $('<div class="col-md-12">');
      var chartHolder = $('<div class="chart">');
      col.append(chartHolder);
      row.append(col);
      $('.container').append(row);
      
      var graphData = [];
      for (var j = 0; j < data.length; j++) {
        var val = parseInt(data[j][key]);
        // Catch NaN errors
        if (!val && val !== 0) {
          continue;
        }
        var dataPoint = [
          new Date(data[j][TIMESTAMP_KEY]).getTime(),
          val
        ];
        graphData.push(dataPoint);
      }
	  Highcharts.setOptions({
		global: {
			 useUTC: false
		},
		chart: {
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(240, 240, 255)']
                    ]
            },
            borderWidth: 0,
            plotBackgroundColor: 'rgba(255, 255, 255, .9)',
            plotShadow: true,
            plotBorderWidth: 0
        },
		area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
	  });
      var chart = chartHolder.highcharts({
        chart: {
          zoomType: 'x',
          type: 'line'
        },
        title: {
          text: key
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: '',
			min: 0
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: key,
          data: graphData
        }]
      });
    }
  }
});
