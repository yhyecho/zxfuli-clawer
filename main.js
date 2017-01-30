var request = require('request');
var writeToFile = require('./writeToFile');
var cheerio = require('cheerio');


var url = 'http://www.11wa.com/type/1.html';
//var Promise = require('bluebird');

request(url,function(err,response,body){
	if(!err && response.statusCode == 200){
		//console.log(body);
		var $ = cheerio.load(body);
		var u = [];
		$('.movie-item').each(function(index,elements){
        var href = $($(elements).children()[0]).attr('href');
        var url = href.slice(parseInt(href.lastIndexOf('/')) + 1,href.lastIndexOf('.'));
        console.log(url);
        u.push(url);
    });
       	for(var i=0; i<u.length;i++){
       		
       		url = 'http://www.11wa.com/show/' + u[i] +'.html';
       	
       		console.log(url);
       	}
  
	}
});


