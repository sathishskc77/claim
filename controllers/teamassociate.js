var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var objectId = mongo.ObjectID;


exports.addMemberInGroup = function(req, res) {
	var memberDetail = req.body;
	var teamName = req.params.name;
	console.log('Adding member to the team: ' + teamName);
	console.log(memberDetail);
	if(memberDetail.id == null) {
		res.status(500).send({'error':'Invalid member id...'});
		return;
	}
	MongoClient.connect(process.env.MONGO_CONNECTION_URL, function (err, db) {
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
