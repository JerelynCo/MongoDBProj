/*
Problems:
	a. Count   the   number   of   times   a   vehicle   travels   within   a   city   at   every   hour   of   the   day   by  taking the average number of times a vehicle entered that city for a given hour. 
		format: {_id: {device_code: device_code, city: city, hour: hour}, value:{average:x}}
	b. Count   how   many   times   vehicle   travels   within   a   city   on   a   given   day   by   taking   the   average  of   number   of   times   a   vehicle   is   found   to   be   in   a   given   city   during   that   day   (i.e.   Monday,  Device 100, 35.5). 
		format: {_id: {device_code: device_code, city: city, day: day}, value:{average:x}}
	c. Based   on   the   results   of   a)   and   b),   determine   the   city   that   vehicles   travel   the   most.   To   do  this,   perform   a   map   reduce   on   the   collections   of   the    results   above   to   be   stored   in  another   collection.   You   will   be   graded   according   to   how   your   documents   in   this  collection will be structured.
		format: {_id: {city: city}, value:{average:x}} 
*/ 

// Initialize
mongo project
load('parser.js');
mongoimport --db project --collection cities --file MM_cities_collection.json --jsonArray

// Problem A
// Mapreduce A
map = function(){
	emit({device_code: this.device_code, city: this.city, month: this.month, day: this.day, hour: this.hour},{count: 1})
}

reduce = function(key,values){
	var total = 0;
	for(var i = 0; i < values.length; i++){
		total += values[i].count;
	}
	return{count: total};
}

db.runCommand({
	mapReduce:'gps_parsed', 
	map: map, 
	reduce: reduce, 
	out:'vehicleCityCountHour'
	//Returns: {_id: {this.device_code, city: this.city, month: this.month, day: this.day, hour: this.hour}, value:{count: total}}
})

// Mapreduce B
map = function(){
	emit({device_code: this._id.device_code, city: this._id.city, hour: this._id.hour},{count: this.value.count})
}

reduce = function(key,values){
	var total = 0;
	for(var i = 0; i < values.length; i++){
		total += values[i].count;
	}
	return{average: total/values.length};
}

db.runCommand({
	mapReduce:'vehicleCityCountHour', 
	map: map, 
	reduce: reduce, 
	out:'vehicleCityAverageHour'
	//Returns: {_id: {device_code: device_code, city: city, hour: hour}, value:{average:x}}
})


