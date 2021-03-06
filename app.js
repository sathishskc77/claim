var express = require('express');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var team = require('./controllers/team.js');
var member = require('./controllers/member.js');
var teamAssociate = require('./controllers/teamassociate.js');
var app = express();
app.use(bodyParser.json());
dotenv.load();

//console.log(app);
app.post('/team', team.createTeam);
app.delete('/team/:name', team.deleteTeam);
app.get('/team/:name', team.getTeam);
app.post('/member', member.createMember);
app.delete('/member/:id', member.deleteMember);
app.get('/member/:id', member.getMember);
app.post('/team/:name/member/', teamAssociate.addMemberInGroup);

app.listen(3000);
console.log('Listening on port 3000...');
