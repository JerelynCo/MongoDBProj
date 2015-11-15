/*
LOADING OF DATA TO GPS COLLECTION
mongoimport --db test --collection gps --file gps_device11_august.json
mongoimport --db test --collection gps --file gps_device11_september.json
mongoimport --db test --collection gps --file gps_device11_october.json

mongoimport --db test --collection gps --file gps_device20_august.json
mongoimport --db test --collection gps --file gps_device20_september.json
mongoimport --db test --collection gps --file gps_device20_october.json

mongoimport --db test --collection gps --file gps_device23_august.json
mongoimport --db test --collection gps --file gps_device23_september.json
mongoimport --db test --collection gps --file gps_device23_october.json

mongoimport --db test --collection gps --file gps_device30_august.json
mongoimport --db test --collection gps --file gps_device30_september.json
mongoimport --db test --collection gps --file gps_device30_october.json

mongoimport --db test --collection gps --file gps_device74_august.json
mongoimport --db test --collection gps --file gps_device74_september.json
mongoimport --db test --collection gps --file gps_device74_october.json

mongoimport --db test --collection gps --file gps_device83_august.json
mongoimport --db test --collection gps --file gps_device83_september.json
mongoimport --db test --collection gps --file gps_device83_october.json
*/


/*
SCHEMA: id, device code, lon, lat, logged_at, session_key, build_number, created_at, updated_at
*/

/*
PROPOSED SCHEMA: id, device code, lon, lat, month, hour, date, day
*/

var daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

for( var i = 0; i < db.gps.find().length(); i++ ){
	var vehicle = db.gps.find()[i].data;
	for( var j = 0; j < vehicle.length; j++ ){
		var data = vehicle[j];

		var datetime = data.logged_at.split("-");
		var time = datetime[2].split("T")[1].split(":");

		var entry = {
			device_code: data.device_code,
			lon: Number(data.lon),
			lat: Number(data.lat),
            date: ISODate(data.logged_at),
            year: Number(datetime[0]),
			month: Number(datetime[1]),
			day: Number(datetime[2].split(":")[0].split("T")[0]),
			hour: Number(time[0]),
			minute: Number(time[1]),
			dayOfTheWeek: daysOfTheWeek[new Date(data.logged_at).getDay()],
		}
		db.gps_parsed.insert(entry);
	}
}
