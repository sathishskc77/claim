var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var objectId = mongo.ObjectID;

exports.getMembersOfGroup = function(req, res) {
	MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
		var name = req.params.name;
		//var db = dbCon.dbConnect();
		console.log('Retrieving team: ' + name);
		collection = db.collection('member_associations');
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

exports.addMemberInGroup = function(req, res) {
	var memberDetail = req.body;
	var teamName = req.params.name;
	console.log('Adding member to the team: ' + teamName);
	console.log(memberDetail);
	if(memberDetail.id == null) {
		res.status(500).send({'error':'Invalid member id...'});
		return;
	}
	MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
			if (err) {
				res.send({'error':'An error has occurred'});
			}
			collection = db.collection('teams');
			collection.findOne({'name':teamName}, function(err, item) {
				console.log(item);
				if(item===null) {
					res.status(500).send({'error':'Team Not found'});
					db.close();
					return;
				}
				else {
					collection = db.collection('members');
					collection.findOne({'_id':new objectId(memberDetail.id)}, function(err, item) {
						if(err) {
							res.send({'error':'An error has occurred in member id.'});
						}
						if(item == null) {
							res.status(500).send({'error':'Menmber Not found'});
							return;
						}
						else {
							collection = db.collection('team_associates');
							collection.findOne({'name':teamName}, function(err, item) {
								console.log(item);
								if(item===null) {
									var member = new Array();
									member.push(memberDetail);
									var memberAdd = {};
									memberAdd.name = teamName;
									memberAdd.members = member;
									console.log(test);
									collection.insert(member, {safe:true}, function(err, result) {
										db.close();
										console.log(result);
										if (err) {
											res.status(500).send({'error':'Duplicate Team name'});
										} else {
											res.status(200).send({'error':'add associates...'});
											db.close();
										}
									});
								}
								else {
									collection.update(team, {safe:true}, function(err, result) {
										db.close();
										console.log(result);
										if (err) {
											res.status(500).send({'error':'Duplicate Team name'});
										} else {
											response = createTeamResultParsing(result);
											res.status(201).json(response);
										}
									});
								}
							});
						}
					});
				}
			});
	});
};

exports.deleteMemberInGroup = function(req, res) {
    var name = req.params.name;
	console.log('Deleting team: ' + name);
	MongoClient.connect('mongodb://localhost:27017/claims_management', function (err, db) {
		collection = db.collection('member_associations');
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
