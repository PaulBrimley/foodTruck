var express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	session = require('express-session'),
	passport = require('passport'),
	localStrategy = require('passport-local'),
	facebookStrategy = require('passport-facebook').Strategy,
    userCtrl = require('./server/controllers/userCtrl.js'),
    truckCtrl = require('./server/controllers/truckCtrl.js'),
    adminCtrl = require('./server/controllers/adminCtrl.js'),
    User = require('./server/models/userModel.js'),
    Truck = require('./server/models/truckModel.js'),
	config = require('./server/config.js');

passport.use('local', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
},function(req, email, password, done) {
	process.nextTick(function() {
	    User.findOne({ 'email': email }, function (err, user) {
	  		if (err) {
                return done(err);
            } else if (user) {
                user.validPassword(password)
                .then(function(response) {
                    if (response === true) {
                        /*req.user = user;*/
                        return done(null, user);
                    } else {
                        return done('Password incorrect', false);
                    }
                })
                .catch(function(err) {
                    return done('Server Error', false);
                });
            } else {
                return done('User not found', false);
            }
		})
	})
}));

passport.use(new facebookStrategy(config.passport.facebook, userCtrl.facebookAuth));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

function ensureAuthenticated(req, res, next) {  
    if (req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
}

var app = express();

var http = require('http').Server(app),
    io = require('socket.io')(80);

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + '/public'));

app.use(session({
	secret: config.sessionSecret,
	saveUninitialized: config.saveUninitialized,
	resave: config.resave
}))

app.use(passport.initialize());
app.use(passport.session());

var mongoUri = config.mongoUri;
mongoose.connect(mongoUri);
mongoose.connection.once('open', function() {
	console.log('Connected to MongoDB');
})


//auth endpoints
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/#/home',
    failureRedirect: '/#/home'
}), function(req, res, next) {

});
app.post('/auth/login', passport.authenticate('local', {failureRedirect: '/#/home' }), userCtrl.getUser);
app.post('/auth/addAccount', userCtrl.create, passport.authenticate('local', {failureRedirect: '/#home'}), userCtrl.getUser);
app.get('/auth/currentUser', userCtrl.getUser);
app.get('/auth/logout', function(req, res, next) {
	req.session.destroy();
	req.logout();
	res.send();
})

//Socket

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('truck offline', function(msg) {
        Truck.findById(msg.truckId, function(err, truck) {
            if (err) return err;
            else {
                var saleToPush = {
                    location: msg.location,
                    sales: msg.sales
                }
                truck.pastLocationsAndSales.push(saleToPush);
                truck.online = false;
                truck.currentLocation = {};
                truck.save(function(err, result) {
                    if (err) return err;
                    else {
                        socket.emit('reply from truck offline', result);
                        io.emit('truck went offline', result);
                        return result;
                    }
                });
            }
        })
    });
    socket.on('truck online', function(msg)  {
        Truck.findById(msg.truckId, function(err, truck) {
            if (err) return err;
            else {
                truck.online = true;
                truck.currentLocation = msg.location;
                truck.save(function(err, result) {
                    if (err) return err;
                    else {
                        socket.emit('reply from truck online', result);
                        io.emit('truck came online', result);
                        return result;
                    } 
                })
            }
        })
    });
    socket.on('toggle disable truck', function(msg) {
        Truck.findById(msg._id, function(err, truck) {
            if (err) return err;
            else {
                truck.enabled = !truck.enabled;
                truck.online = false;
                truck.save(function(err, result) {
                    if (err) return err;
                    else {
                        if (msg.online === true) {
                            socket.emit('reply from toggle disable truck', result);
                            io.emit('truck went offline', result);
                        } else {
                            socket.emit('reply from toggle disable truck', result);
                        }
                    } 
                })
            }
        })
    })
})


//user endpoints
app.get('/user/getOnlineTrucks', truckCtrl.getOnlineTrucks);
app.put('/user/updateProfile', userCtrl.updateProfile);
app.put('/user/connectTruckToUser', userCtrl.connectTruckToUser);
app.put('/user/addFavTruck', userCtrl.addFavoriteTruck, truckCtrl.addFavToTruck);
app.put('/user/removeFavTruck', userCtrl.removeFavoriteTruck, truckCtrl.removeFavFromTruck);

//admin endpoints
app.get('/admin/getAllUsers', adminCtrl.getAllUsers);
app.get('/admin/getAllTrucks', adminCtrl.getAllTrucks);
app.post('/admin/createTruck', adminCtrl.createTruck);
app.put('/admin/toggleDisableTruck', adminCtrl.toggleDisableTruck);
app.put('/admin/deleteTruck', adminCtrl.deleteTruck);
app.put('/admin/makeAdmin/:userId', adminCtrl.makeAdmin);
app.put('/admin/removeAdmin/:userId', adminCtrl.removeAdmin);
app.delete('/admin/deleteUser/:userId', adminCtrl.deleteUser);

//truck endpoints
app.put('/truck/updateProfile', truckCtrl.updateProfile);
app.put('/truck/addMenuItem/:truckId', truckCtrl.addMenuItem);
app.put('/truck/deleteMenuItem/:truckId', truckCtrl.deleteMenuItem);
app.post('/truck/addSpecial/:truckId', truckCtrl.addSpecial);
app.put('/truck/deleteSpecial/:specialId', truckCtrl.deleteSpecial);

app.post('/truck/addSalesAndLocation/:truckId', truckCtrl.addSalesAndLocation)
app.put('/truck/online/:truckId', truckCtrl.online);


http.listen(config.port, function() {
	console.log('You are here at: ', config.port);
})