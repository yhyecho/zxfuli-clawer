var request = require("request");
var path = require("path");
var fs = require("fs");

var options = {
	url: 'http://bs.6no.cc/jx/dapi.php?id=o66iyZ3KrqSibmlklZhnamli&key=d8954ab714853662',
	headers: {
		'Referer' : 'http://www.11wa.com/'
	}
};

function callback(error,response,body) {
	if(!error && response.statusCode == 200){
		var start = body.indexOf('[') + 2;
		var result = body.slice(start);
		var end = result.indexOf(']') - 1;
		//console.log(result);
		//console.log(end);
		var movieUrl = result.slice(0,end);
		//console.log(movieUrl);
		//console.log("==============");
		console.log(body);
		writeTofile(movieUrl);
	}
}

function writeTofile(obj){
	var filePath = path.join(__dirname,'data.txt');
	console.log(filePath);
	fs.writeFile(filePath,obj,function(err){
		if(err){
			return console.error(err);
		}
	});
	console.log("write success!");
}
request(options,callback);