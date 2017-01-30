var path = require('path');
var fs = require('fs');

var filePath = path.join(__dirname,'data.txt');
var writeToFile = function(obj){
	fs.writeFile(filePath,obj,function(err){
		if(err){
			console.error(err);
		}

		console.log('writeFile succeed!');
	});
}


module.exports = writeToFile;