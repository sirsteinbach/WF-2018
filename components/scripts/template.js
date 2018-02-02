$(function() {
  var Mustache = require('mustache');

  $.getJSON('_js/data.json', function(data) {
    var template = $('#speakerstpl').html();
    var html = Mustache.to_html(template, data);
    $('#speakers').html(html);
  }); //getJSON

}); //function
