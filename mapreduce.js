// Loading of the parser.js to load entries to collection gps_parsed
mongo project
load('parser.js');

mongoimport --db project --collection cities --file MM_cities_collection.json --jsonArray

/*
	Problem a: Count   the   number   of   times   a   vehicle   travels   within   a   city   at   every   hour   of   the   day   by  taking the average number of times a vehicle entered that city for a given hour. 
		format: {_id: {device_code: device_code, city: city, hour: hour}, value:{average:x}}
			First mapreduce returning the number of vehicles per date per hour per vehicle per city
			Second mapreduce fed with the first mapreduce shows the average per hour per vehicle per city
*/

// Mapreduce A
map_A = function(){
	emit({device_code: this.device_code, city: this.city, month: this.month, day: this.day, hour: this.hour},{count: 1})
}

reduce_A = function(key,values){
	var total = 0;
	for(var i = 0; i < values.length; i++){
		total += values[i].count;
	}
	return{count: total};
}

db.runCommand({
	mapReduce:'gps_parsed', 
	map: map_A, 
	reduce: reduce_A, 
	out:'vehicleCityCountHour'
	//Returns: {_id: {this.device_code, city: this.city, month: this.month, day: this.day, hour: this.hour}, value:{count: total}}
})

// Mapreduce B
map_B = function(){
	emit({device_code: this._id.device_code, city: this._id.city, hour: this._id.hour},{count: this.value.count})
}

reduce_B = function(key,values){
	var total = 0;
	for(var i = 0; i < values.length; i++){
		total += values[i].count;
	}
	return{average: total/values.length};
}

db.runCommand({
	mapReduce:'vehicleCityCountHour', 
	map: map_B, 
	reduce: reduce_B, 
	out:'vehicleCityAverageHour'
	//Returns: {_id: {device_code: device_code, city: city, hour: hour}, value:{average:x}}
})


/*
	Problem b: Count   how   many   times   vehicle   travels   within   a   city   on   a   given   day   by   taking   the   average  of   number   of   times   a   vehicle   is   found   to   be   in   a   given   city   during   that   day   (i.e.   Monday,  Device 100, 35.5). 
		format: {_id: {device_code: device_code, city: city, day: day}, value:{average:x}}
			First mapreduce returning the count of vehicle in a city per dayOfTheWeek per vehicle per date per city
			Second mapreduce fed with the first mapreduce shows the average per day per vehicle per city
*/


// Mapreduce A
map_A = function(){
	emit({device_code: this.device_code, city: this.city, month: this.month, day: this.day, dayOfTheWeek: this.dayOfTheWeek},{count: 1})
}

reduce_A = function(key,values){
	var total = 0;
	for(var i = 0; i < values.length; i++){
		total += values[i].count;
	}
	return{count: total};
}

db.runCommand({
	mapReduce:'gps_parsed', 
	map: map_A, 
	reduce: reduce_A, 
	out:'vehicleCityCountDay'
	//Returns: {_id: {this.device_code, city: this.city, month: this.month, day: this.day, hour: this.hour}, value:{count: total}}
})

// Mapreduce B
map_B = function(){
	emit({device_code: this._id.device_code, city: this._id.city, dayOfTheWeek: this._id.dayOfTheWeek},{count: this.value.count})
}

reduce_B = function(key,values){
	var total = 0;
	for(var i = 0; i < values.length; i++){
		total += values[i].count;
	}
	return{average: total/values.length};
}

db.runCommand({
	mapReduce:'vehicleCityCountDay', 
	map: map_B, 
	reduce: reduce_B, 
	out:'vehicleCityAverageDay'
	//Returns: {_id: {device_code: device_code, city: city, dayOfTheWeek: dayOfTheWeek}, value:{average:x}}
})


/*
	Problem c: Based   on   the   results   of   a)   and   b),   determine   the   city   that   vehicles   travel   the   most.   To   do  this,   perform   a   map   reduce   on   the   collections   of   the    results   above   to   be   stored   in  another   collection.   You   will   be   graded   according   to   how   your   documents   in   this  collection will be structured.
		format: {_id: {city: city}, value:{average:x}}
*/
