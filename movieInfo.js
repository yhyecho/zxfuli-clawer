var cheerio = require('cheerio');
var superagent = require('superagent');
var request = require('request');
var path = require('path');
var fs = require('fs');

var connPool = require('./mysql');

var row1 = {};
/*
	director: 导演
	actor: 演员
	type: 类型
	country: 国家
	updateStatus: 更新状态
	showDate: 上映时间
	score: 评分
	title: 电影标题
	summary: 摘要
	updateDate: 更新时间
	image: 图片
	moviceUrl: 电影链接
*/

	getMovieInfo('http://www.11wa.com/show/21865.html',function(){
		//getMovieInfo('http://www.11wa.com/show/19970.html');
		console.log('1111');
	});

	


function getMovieInfo(url) {
	superagent.get(url)
    .end(function (err, res) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var mArray = new Array("director","actor","type","country","updateStatus","showDate","score");
        var $ = cheerio.load(res.text);
        var temp = '';
        $('table tr').each(function(index,element){
        	var aObj = $(this).children()[1];
        	//console.log($(aObj).text());
        	//row1.mArray[1] = $(aObj).text();
        	//console.log(mArray[index]);
        	temp = mArray[index];
        	row1[temp] = $(aObj).text();
        });
        var aDate = $('#add_fav').next().next().text().trim();
        var startIndex = aDate.indexOf('2');
        //console.log(aDate.substring(startIndex));
        row1.updateDate = aDate.substring(startIndex);
        //console.log($('#add_fav').next().next().text());
        row1.summary = $('.summary').text();
        row1.image = $('.img-thumbnail').attr('src');
        row1.title = $('.movie-title').text();
        
        //console.log($('.img-thumbnail').attr('src'));
        //console.log($('.img-thumbnail').attr('alt'));
        //console.log($('.summary').text());
        //console.log(row1);
        test(url);

    });
}


function test(url){ 
	var playUrl = url.replace("show","play");
	superagent.get(playUrl).end(function(err, res){
		if(err){
			console.error(err);
		}
		var $ = cheerio.load(res.text);
		var moviceAddress = $("#player_swf").attr("src");
		//console.log(moviceAddress);
		getMovieUrl(moviceAddress);
	});   
}

function getMovieUrl(address){
	options = {
		url: address,
		headers : {
			'Referer' : 'http://www.11wa.com/'
		}
	}

	function callback(error,response,body) {
		if(!error && response.statusCode == 200){
			var start = body.indexOf('[') + 2;
			var result = body.slice(start);
			var end = result.indexOf(']') - 1;
			
			var movieUrl = result.slice(0,end);
			//console.log(movieUrl);
			row1.moviceUrl = movieUrl;
			//console.log(row1);
			//save(row1);
			console.log(row1);
		}
	}

	request(options,callback);
}

function save(obj){
	/*
	connection.connect(function(err){
		if(err){
			return console.error(err);
		}
		console.log("connect success!");
	});

	var sql = "insert into movie (director,actor,type,country,updateStatus,showDate,score,title,summary,updateDate,image,moviceUrl) values(?,?,?,?,?,?,?,?,?,?,?,?);";
	
	var params = [obj.director,obj.actor,obj.type,obj.country,obj.updateStatus,obj.showDate,obj.score,obj.title,obj.summary,obj.updateDate,obj.image,obj.moviceUrl];
	connection.query(sql,params,function (err,result){
		if(err){
			return console.error(err);
		}

		console.log("insert success!"  + result );
	});
	connection.end(function(err){
		if(err){
			return console.error(err);
		}

		console.log("close connect succeed!");
	});*/
	connPool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
	  	var sql = "insert into movie (director,actor,type,country,updateStatus,showDate,score,title,summary,updateDate,image,moviceUrl) values(?,?,?,?,?,?,?,?,?,?,?,?)";
	  	var params = [obj.director,obj.actor,obj.type,obj.country,obj.updateStatus,obj.showDate,obj.score,obj.title,obj.summary,obj.updateDate,obj.image,obj.moviceUrl];
	  	connection.query(sql, params, function(err,result){
	  		if(err){
	  			return console.error(err);
	  		}
	  		connection.release();
	  		return console.log('insert success!');
	  	});

	});

	
}

/*function writeTofile(obj){
	var filePath = path.join(__dirname,'data.txt');
	console.log(filePath);




	fs.writeFile(filePath,obj,function(err){
		if(err){
			return console.error(err);
		}
	});
	console.log("write success!");
}*/

