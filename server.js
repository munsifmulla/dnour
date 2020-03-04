var express = require('express'),
	app = express(),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	// Auth Packages
	jwt = require('jsonwebtoken'),
	session = require('express-session'),
	passport = require('passport'),
	MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config();

//Using Cors
app.options('*', cors());
// var allowedOrigins = ['http://localhost:3300', 'http://dnour.com', 'https://dnour.com'];
// app.use(cors({
// 	origin: function (origin, callback) {
// 		// allow requests with no origin 
// 		// (like mobile apps or curl requests)
// 		if (!origin) return callback(null, true);
// 		if (allowedOrigins.indexOf(origin) === -1) {
// 			var msg = 'The CORS policy for this site does not ' +
// 				'allow access from the specified Origin.';
// 			return callback(new Error(msg), false);
// 		}
// 		return callback(null, true);
// 	}
// }));

// Helpers and Utils
const http = require('./lib/helpers/http');
const urls = require('./lib/constants/urls');

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
		console.log("Error in Session Creation", error);
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
app.set('secretKey', process.env.SALT);
app.set('dashboardView', './dashboard/views');

// Static files server
app.use(express.static('./dashboard/css', { maxAge: 31557600 }));
app.use(express.static('./dashboard/js', { maxAge: 31557600 }));
app.use(express.static('./dashboard/images', { maxAge: 31557600 }));

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

//Authenticated User
app.use(function (req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.env = process.env;
	next();
})

// PRIVATE API Routes Requires Auth
var api = require('./routes/api');
app.use('/api', validateUser, api);

//PUBLIC API Routes Pre Auth
var user = require('./routes/user');
app.use('/api-user', user);

//View Routes
var views = require('./routes/view');
app.use('/', views);

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
		res.status(500).json("Something looks wrong :( !!!");
	}
});

//App Server
app.listen(process.env.PORT);
console.log("Now listening on ", process.env.PORT);