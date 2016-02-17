var User = require('./../models/userModel.js');

module.exports = {

	facebookAuth: function(token, refreshToken, profile, done) {
	    User.findOne({
	        'facebookId': profile.id
	    }, function(err, result) {
	        if (err) {
	            return done(err, false);
	        }
	        else if (result) {
	        	/*req.user = result;*/
	            return done(null, result);
	        }
	        else {
	            var tempNewUser = {
	                userName: profile.displayName, 
	                email: profile.emails[0].value,
	                facebookId: profile.id,
	                permissions: ['User']
	            };
	            var newUser = new User(tempNewUser)
	            newUser.save(function(err, saveResult) {
	                if(err) {
	                    return done(err, false) 
	                }
	                else {
	                    return done(null, saveResult)
	                }
	            })
	        }
	    })
	},
	create: function(req, res, next) {
	    User.findOne({'email': req.body.email}, function(err, user) {
	        if (user) {
	            res.status(403).send('Email already exists. Please use a different email.');
	        } else {
			    var newUser = new User();
			    newUser.permissions = ['User'];
			    newUser.userName = req.body.userName;
			    newUser.email = req.body.email;
			    newUser.generateHash(req.body.password).then(function(response) {
			        newUser.password = response;
			        newUser.save(function(err, result) {
			            if (err) {
			                res.status(500).send();
			            } else {
			            	next();
			                /*res.send(result);*/
			            }
			        })
			    });
			}
	    })
	},
	updateProfile: function(req, res, next) {
		User.findById(req.user._id, function(err, user) {
			if (err) res.status(500).send(err);
			else {
				user.userName = req.body.userName;
				user.generateHash(req.body.password).then(function(response) {
					user.password = response;
					user.save(function(err, result) {
						if (err) res.status(500).send(err);
						else res.send(user); 
					})
				})
			}
		})
	},
	connectTruckToUser: function(req, res, next) {
		User.findById(req.body.connectedUserRef, function(err, user) {
			if (err) res.status(500).send(err);
			else {
				user.connectedTruckRef = req.body._id;
				if (user.permissions.indexOf('FoodTruck') === -1) {
					user.permissions.push('FoodTruck');
				}
				user.save(function(err, result) {
					if (err) res.status(500).send(err);
					else res.send(result);
				})
			}
		})
	},
	addFavoriteTruck: function(req, res, next) {
		User.findById(req.user._id, function(err, user) {
			if (err) res.status(500).send(err);
			else {
				user.favoriteTrucks.push(req.body._id);
				user.save(function(err, result) {
					if (err) res.status(500).send(err);
					else next();
				});	
			}
		})
	},
	removeFavoriteTruck: function(req, res, next) {
		User.findById(req.user._id, function(err, user) {
			if (err) res.status(500).send(err);
			else {
				req.body._id = req.body._id.toString();
				for (var i = 0; i < user.favoriteTrucks.length; i++) {
					user.favoriteTrucks[i] = user.favoriteTrucks[i].toString();
					if (req.body._id === user.favoriteTrucks[i]) {
						user.favoriteTrucks.splice(i, 1);
					}
				}
				user.save(function(err, result) {
					if (err) res.status(500).send(err);
					else next();
				})
			}
		})
	},
	getUser: function(req, res, next) {
		if (req.isAuthenticated()) {
			User.findById(req.user._id).populate({path:'favoriteTrucks connectedTruckRef'}).exec(function(err, user) {
				if (err) res.status(500).send(err);
				else if (!user) {
					req.status(401).send();
				}
				else {
					var options = {
						path: 'connectedTruckRef.specials',
						model: 'specials'
					}
					User.populate(user, options, function(err, truck){
						if (err) res.status(500).send(err);
						else res.send(truck);
					}) 
				}
			});
		} else res.status(401).send();
	}
}







