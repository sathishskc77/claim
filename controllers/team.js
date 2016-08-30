var MongoClient = require('mongodb').MongoClient;

exports.getTeam = function(req, res) {
	MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
		var name = req.params.name;
		//var db = dbCon.dbConnect();
		console.log('Retrieving team: ' + name);
		collection = db.collection('teams');
			collection.findOne({'name':name}, function(err, item) {
				console.log(err);
				db.close();
				if(item) {
					response = getTeamResultParsing(item);
					res.status(200).json(response);
				}
				else {
					res.status(500).send({'error':'Team Not found'});
				}
			});
	});
};

exports.createTeam = function(req, res) {
	team = req.body;
	console.log(team);
	MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
			if (err) {
				console.log(err);
				res.send({'error':'An error has occurred'});
			}
			collection = db.collection('teams');
			collection.insert(team, {safe:true}, function(err, result) {
				db.close();
				console.log(result);
				if (err) {
					res.status(500).send({'error':'Duplicate Team name'});
				} else {
					response = createTeamResultParsing(result);
					res.status(201).json(response);
				}
			});
	});
};

exports.deleteTeam = function(req, res) {
    var name = req.params.name;
	console.log('Deleting team: ' + name);
	MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
		collection = db.collection('teams');
        collection.remove({'name':name}, {safe:true}, function(err, result) {
			db.close();
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
				res.status(204).send();
            }
        });
	});
};

createTeamResultParsing = function (result) {
	return {
		name: result.ops[0].name,
		description: result.ops[0].description
	};
};
getTeamResultParsing = function (result) {
	return {
		name: result.name,
		description: result.description
	};
};
