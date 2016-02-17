var User = require('./../models/userModel.js'),
	Truck = require('./../models/truckModel.js');

module.exports = {

	getAllUsers: function(req, res, next) {
		User.find({}).populate('connectedTruckRef').exec(function(err, users) {
			if (err) res.status(500).send(err);
			else res.send(users);
		});
	},
	getAllTrucks: function(req, res, next) {
		Truck.find({}).populate('connectedUserRef').exec(function(err, trucks) {
			if (err) res.status(500).send(err);
			else res.send(trucks);
		});
	},
	createTruck: function(req, res, next) {
		var newTruck = new Truck();
		newTruck.connectedUserRef = req.body.connectedUserRef;
		newTruck.truckName = req.body.truckName;
		newTruck.homeBase = req.body.homeBase;
		newTruck.enabled = req.body.enabled;
		newTruck.online = false;
		newTruck.picture = req.body.picture;
		newTruck.favorites = 0;
		newTruck.save(function(err, result) {
			if (err) res.status(500).send(err);
			else res.send(result);
		})
	},
	toggleDisableTruck: function(req, res, next) {
		Truck.findOne({_id: req.body._id}, function(err, truck) {
			if(err) res.status(500).send(err);
			else {
				truck.enabled = !truck.enabled;
				truck.save(function(err, result) {
					if (err) res.status(500).send(err);
					else res.send(result);
				})
			}
		})
	},
	deleteTruck: function(req, res, next) {
		User.findOne({_id: req.body.connectedUserRef}, function(err, user) {
			if (err) res.status(500).send(err);
			else {
				user.connectedTruckRef = undefined;
				user.save(function(err, result) {
					if (err) res.status(500).send(err);
					else {
						Truck.findOneAndRemove({_id: req.body._id}, function(err, result) {
							if(err) res.status(500).send(err);
							else res.send(result);
						})
					}
				})
			}
		})
		
	},
	deleteUser: function(req, res, next) {
		User.findOneAndRemove({_id: req.params.userId}, function(err, result) {
			if(err) res.status(500).send(err);
			else res.send(result);
		})
	},
	makeAdmin: function(req, res, next) {
		User.findOne({_id: req.params.userId}, function(err, user) {
			if (err) res.status(500).send(err);
			else {
				if (user.permissions.indexOf('Admin') === -1) {
					user.permissions.push('Admin');
				}
				user.save(function(err, result) {
					if (err) res.status(500).send(err);
					else {
						res.send(result);
					}
				})
			}
		})
	},
	removeAdmin: function(req, res, next) {
		User.findOne({_id: req.params.userId}, function(err, user) {
			if (err) res.status(500).send(err);
			else {
				if (user.permissions.indexOf('Admin') !== -1) {
					user.permissions.splice(user.permissions.indexOf('Admin'), 1);		
				}
				user.save(function(err, result) {
					if (err) res.status(500).send(err);
					else {
						res.send(result);
					}
				})
			}
		})
	}
}