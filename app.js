var express = require('express'),
    bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./appDb.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the appDb database.');
});
var app = express();
var port = process.env.PORT || 3000;
/*
var User = require('./models/userModel');
var Group = require('./models/groupModel');
*/
app.use(express.static(__dirname + '/Views'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/node_modules/jquery'));
app.use(express.static(__dirname + '/node_modules/bootstrap'));
app.use(express.static(__dirname + '/js'));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

usersRouter = require('./Routes/userRoutes')(db);
groupsRouter = require('./Routes/groupRoutes')(db);

app.use('/api/users', usersRouter);
app.use('/api/groups', groupsRouter);

app.get('/', function (req, res) {
      res.sendFile('index.html');
});

app.listen(port, function () {
    console.log('Gulp is runing on PORT: ' + port);
});

