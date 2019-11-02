var express = require('express'),
	app = express(),
	challenge = require('./server/models/models'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	fetch = require('node-fetch'),
	jwt = require('jsonwebtoken'),
	// Auth Packages
	session = require('express-session'),
	passport = require('passport'),
	MongoDBStore = require('connect-mongodb-session')(session),
	PORT = process.env.PORT = 3300;

//Data base connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/dnour', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Session Store
var sessionStore = new MongoDBStore({
	uri: 'mongodb://localhost/dnour',
	databaseName: 'dnour',
	collection: 'sessions'
},
	function (error) {
		// Should have gotten an error
	});

//Session and Login Support by Passport
app.use(session({
	secret: 'jdfjkdshfjhf',
	resave: false,
	store: sessionStore,
	saveUninitialized: false,
	// cookie: { secure: true } // Uncomment when using HTTPS
}));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false, cookie: { maxAge: 60000 } }))
app.use(passport.initialize());
app.use(passport.session());

// Templating engine
app.set('view engine', 'pug');
app.set('views', './dashboard/views');
app.set('secretKey', 'topSecret');
app.set('dashboardView', './dashboard/views');

// Static files server
app.use(express.static('./dashboard/css'));
app.use(express.static('./dashboard/js'));

//Auth validating user
function validateUser(req, res, next) {
	jwt.verify(req.headers['access-token'], req.app.get('secretKey'), function (err, decoded) {
		if (err) {
			res.json({ status: "error", message: err.message, data: null });
		} else {
			req.body.userId = decoded.id;
			next();
		}
	});
}

//Validating Routes
function validateRoute() {
	return (req, res, next) => {
		if (req.isAuthenticated()) return next();
		res.redirect('/dashboard/login');
	}
}

//Authenticated User
app.use(function (req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
})

// PRIVATE API Routes
var api = require('./routes/api');
app.use('/api', validateUser, api);

//PUBLIC API Routes
var user = require('./routes/user');
app.use('/api-user', user);

// Pre Fetching Data
const API_BASE = 'http://localhost:3300/api';
let urls = {
	list: API_BASE + '/list-log',
	getLog: API_BASE + '/get-log',
};

const fetchData = (url, method, body, token) => {
	return fetch(url, {
		method: method, // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json',
			'Access-token': token,
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrer: 'no-referrer', // no-referrer, *client
		body: body && JSON.stringify(body), // body data type must match "Content-Type" header
	})
		.then(response => response.json());
}

// View Routes
app.get('/dashboard', validateRoute(), async (req, res) => {
	console.log("User ===> ", req.user);
	console.log("Token ===> ", req.session.token);
	console.log("Logged in ===> ", req.isAuthenticated());

	res.render("dashboard", {
		showMenu: true,
		// listData: data.data,
		// count: data.total
	});
});

app.get('/dashboard/login', (req, res) => {
	res.render("login", {
		showMenu: false
	});
})

app.get('/logout', (req, res) => {
	req.logout();
	req.session.destroy();
	res.render("login", {
		showMenu: false
	});
})
app.get('/register', (req, res) => {
	res.render("register", {
		showMenu: false
	});
})

//Route not found
app.use(function (req, res, next) {
	res.render("404");
});
// handle errors
app.use(function (err, req, res, next) {
	if (err.status === 404)
		res.status(404).json({ message: "Not found" });
	else {
		console.log(err, "Err");
		res.status(500).json({ message: "Something looks wrong :( !!!" });
	}
});

//App Server
app.listen(PORT);
console.log("Now listening on ", PORT);