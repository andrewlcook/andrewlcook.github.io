var public_key = '4JJyAzpz3vtw06EnDXnW';

var TIMESTAMP_KEY = 'timestamp';

$('.sparkfun-link').text('Phant Stream: ' + public_key);
$('.sparkfun-link').attr('href', 'https://data.sparkfun.com/streams/' + public_key);

$.ajax({
  url: 'http://data.sparkfun.com/output/' + public_key + '.json',
  jsonp: 'callback',
  dataType: 'jsonp',
  data: 'page=1',
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
            text: ''
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
