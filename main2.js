var superagent = require('superagent');
var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
var writeTofile = require('./writeTofile');

var url = 'http://www.11wa.com/type/18.html';


request.get(url,function(err,res,body){
	if(err){
		console.error(err);
	}
	
	if (!err && res.statusCode == 200) {
		var $ = cheerio.load(body);
		var result = $('.row').next().next().text();
		var start = result.indexOf('/') + 1;
		var end = result.indexOf('页');
		totalPage = result.slice(start, end); 
		//console.log(totalPage);

		url = url.slice(0, url.lastIndexOf('.'));
		// console.log(url);
		var tagetUrl = '';
		urlArray = [];
		for(var i = 1; i <= totalPage; i++){
			tagetUrl =  url + '/' + i + '.html';
			//console.log(tagetUrl);
			urlArray.push(tagetUrl);
		}

		async.mapLimit(urlArray,10,function(url, callback) {
			fetchUrl(url,callback);
		},function(err,result){
			
			result = result.toString().split(',');
			async.mapLimit(result,10,function(url,callback) {
				fetchMovieInfo(url,callback);
			},function(err,result){
				
			});
		
		});


		
	} else {
		console.log('连接异常!');
	}
	

});


function fetchUrl(url,callback){
	request(url,function(err,response,body){
		if (!err && response.statusCode == 200){
			console.log('正在抓取 ' + url + '页面');
			var $ = cheerio.load(body);
			var u = [];
			$('.movie-item').each(function(index,elements){
				var href = $($(elements).children()[0]).attr('href');
				var url = href.slice(parseInt(href.lastIndexOf('/')) + 1,href.lastIndexOf('.'));
				// console.log(url);
				u.push('http://www.11wa.com/show/' + url +'.html');

			});
			
			callback(null,u);
			
		}
	});
}


function fetchMovieInfo(url, callback){
	var movieInfoArr = [];
	request(url,function(err,res,body){
		var playUrl = url.replace("show","play");
		if(err){
			console.log(err);
		}
		if(!err && res.statusCode == 200){
			console.log('正在抓取  ' + url +  '页面的     movieInfo');
			
			var movieInfo = {};
			

			var mArray = new Array("director","actor","type","country","updateStatus","showDate","score");
	        var $ = cheerio.load(body);
	        var temp = '';
	        $('table tr').each(function(index,element){
	        	var aObj = $(this).children()[1];
	        	temp = mArray[index];
	        	movieInfo[temp] = $(aObj).text();
	        });
			
			var aDate = $('#add_fav').next().next().text().trim();
	        var startIndex = aDate.indexOf('2');
	        
	        movieInfo.updateDate = aDate.substring(startIndex);
	        
	        movieInfo.summary = $('.summary').text();
	        movieInfo.image = $('.img-thumbnail').attr('src');
	        movieInfo.title = $('.movie-title').text();
	        movieInfo.originUrl = playUrl;
        	
	        analyze(playUrl,movieInfo);

	        callback(null,movieInfoArr);
		}


		
	});
	
}

function analyze(url,obj){
	
	request(url,function(err,res,body){
		//var movieArr = [];
		if(!err && res.statusCode == 200){
			var $ = cheerio.load(body);
			var moviceAddress = $("#player_swf").attr("src");
			obj.moviceAddress = moviceAddress;
			
			getMovieUrl(moviceAddress,obj)
			
		}
		if(err){
			console.log(err);
		}
	});

}


function getMovieUrl(address,obj){

	options = {
		url: address,
		headers : {
			'Referer' : 'http://www.11wa.com/'
		}
	}

	function callback(err,response,body) {
		if(err){
			console.error(err);
		}
		if(!err && response.statusCode == 200){
			
			var start = body.indexOf('[') + 2;
			var result = body.slice(start);
			var end = result.indexOf(']') - 1;
			
			obj.movieUrl = result.slice(0,end);
			
			console.log(obj);
			
		}
		
	}

	request(options,callback);
}
