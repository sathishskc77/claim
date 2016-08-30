var mongo = require('mongodb');
var isConnected = false;
var db;
exports.dbConnect = function () {
	var Server = mongo.Server,
		Db = mongo.Db;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	db = new Db('claims_management', server);
console.log(isConnected);
	if(!isConnected) {
		db.open(function(err, db) {
			if(!err) {
				isConnected = true;
				console.log("Connected to 'claims' database");
			}
		});
	}
	return db;
}
this.dbConnect();