var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var objectId = mongo.ObjectID;

exports.createMember = function(req, res) {
	var member = req.body;
		MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
			if (err) {
				console.log(err);
				res.send({'error':'An error has occurred'});
			}
			collection = db.collection('members');
			collection.insert(member, {safe:true}, function(err, result) {
				if (err) {
					res.status(500).send({'error':'Duplicate Email Address!'});
				} else {
					response = createMemberResultParsing(result);
					res.status(201).json(response);
				}
			});
		});
};

exports.deleteMember = function(req, res) {
    var id = req.params.id;
	//var db = dbCon.dbConnect();
    console.log('Deleting member with id: ' + id);
	MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
		collection = db.collection('members');
        collection.remove({'_id':new objectId(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
				res.status(204).send();
            }
        });
	});
};

exports.getMember = function(req, res) {
    var id = req.params.id;
	//var db = dbCon.dbConnect();
    console.log('Retrieving member with id: ' + id);
	MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
		if(err){
			res.status(500).send({'error':'Member Not found'});
		}
		collection = db.collection('members');
        collection.findOne({'_id':new objectId(id)}, function(err, item) {
			if(item) {
				response = getMemberResultParsing(item);
				res.status(200).json(response);
			}
			else {
				res.status(500).send({'error':'Member Not found'});
			}
        });
	});
};

createMemberResultParsing = function (result) {
	console.log(result);
	return {
		uniqueKey: result.ops[0]._id,
		name: result.ops[0].name,
		email: result.ops[0].email
	};
};

getMemberResultParsing = function (result) {
	console.log(result);
	return {
		uniqueId: result._id,
		name: result.name,
		email: result.email
	};
};
