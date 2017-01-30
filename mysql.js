var mysql = require('mysql');
/*
	create database zxfuli;
	use database zxfuli;
	create table movice(
	id int(10) not null auto_increment,
	director varchar(20),
	actor varchar(20),
	type varchar(20),
	country varchar(20),
	updateStatus varchar(20),
	showDate varchar(10),
	score varchar(10),
	title varchar(50) not null unique,
	summary text,
	updateDate varchar(20),
	image varchar(50),
	moviceUrl varchar(100),
	primary key(id)
	)engine=innodb default charset=utf8;

*/

var pool = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	port: '3306',
	database: 'zxfuli'
});

/*connection.connect(function(err){
	if(err){
		return console.error(err);
	}

	console.log('[connection connect] succeed!' );
});

var sql = "SELECT * FROM movie";

connection.query(sql, function(err, result){
	if(err){
		return console.error(err);
	}

	console.log(result);
});

connection.end(function(err){
	if(err){
		return console.error(err);
	}
	console.log('close connection succeed!');
});*/

module.exports = pool;