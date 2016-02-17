var	Truck = require('./../models/truckModel.js'),
	Special = require('./../models/specialModel.js');

module.exports = {

	updateProfile: function(req, res, next) {
		Truck.findById(req.body._id, function(err, truck) {
			if (err) res.status(500).send(err);
			else {
				truck.truckName = req.body.truckName;
				truck.homeBase = req.body.homeBase;
				truck.typeOfFood = req.body.typeOfFood;
				truck.save(function(err, result) {
					if (err) res.status(500).send(err);
					else res.send(result);
				})
			}
		})
	},
	addMenuItem: function(req, res, next) {
		Truck.findById(req.params.truckId, function(err, truck) {
			if (err) res.status(500).send(err);
			else {
				for (var i = 0; i < truck.menu.length; i++) {
		            if (req.body.item === truck.menu[i]) {
		                return res.send('Item already in menu.');
		            }
		        }
				truck.menu.push(req.body.item);
				truck.save(function(err, result) {
					if (err) res.status(500).send(err);
					else res.send(result);
				})
			}
		})
	},
	deleteMenuItem: function(req, res, next) {
		Truck.findById(req.params.truckId, function(err, truck) {
			if (err) res.status(500).send(err);
			else {
				for (var i = 0; i < truck.menu.length; i++) {
					if (req.body.item === truck.menu[i]) {
						truck.menu.splice(i, 1);
						truck.save(function(err, result) {
							if (err) res.status(500).send(err);
							else res.send(result);
						})
					}
				}
			}
		})
	},
	addSpecial: function(req, res, next) {
		var newSpecial = new Special();
		newSpecial.truckRef = req.params.truckId;
		newSpecial.special = req.body.special;
		newSpecial.save(function(err, result) {
			if (err) res.status(500).send(err);
			else {
				Truck.findById(req.params.truckId, function(err, truck) {
					if (err) res.status(500).send(err);
					else {
						truck.specials.push(result._id);
						truck.save(function(err, saveResult) {
							if (err) res.status(500).send(err);
							else {
								res.send(result);
							} 
						})
					}
				})
			} 
		})
	},
	deleteSpecial: function(req, res, next) {
		Special.findOneAndRemove({_id: req.params.specialId}, function(err, special) {
			if (err) res.status(500).send(err);
			else {
				Truck.findById(req.body.truckRef, function(err, truck) {
					for (var i = 0; i < truck.specials.length; i++) {
						req.params.specialId=req.params.specialId.toString();
						truck.specials[i]=truck.specials[i].toString();
						if (truck.specials[i] === req.params.specialId) {
							truck.specials.splice(i, 1);
							truck.save(function(err, result) {
								if (err) res.status(500).send(err);
								else return res.send(special);
							})
						}
					}
				})
			} 
		})
	},
	addSalesAndLocation: function(msg) {
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
						return result;
					}
				});
			}
		})
	},
	online: function(msg) {
        Truck.findOne(msg.truckId, function(err, truck) {
            if (err) return err;
            else {
                truck.online = true;
                truck.currentLocation = req.body;
                truck.save(function(err, result) {
                    if (err) return err;
                    else return result;
                })
            }
        })
    },
	/*online: function(req, res, next) {
		Truck.findOne({_id: req.params.truckId}, function(err, truck) {
			if (err) res.status(500).send(err);
			else {
				truck.online = true;
				truck.currentLocation = req.body;
				truck.save(function(err, result) {
					if (err) res.status(500).send(err);
					else res.send(result);
				})
			}
		})
	},
	addSalesAndLocation: function(req, res, next) {
		Truck.findOne({_id: req.params.truckId}, function(err, truck) {
			if (err) res.status(500).send(err);
			else {
				truck.pastLocationsAndSales.push(req.body);
				truck.online = false;
				truck.currentLocation = {};
				truck.save(function(err, result) {
					if (err) res.status(500).send(err);
					else res.send(result);
				});
			}
		})
	},*/
	addFavToTruck: function(req, res, next) {
		Truck.findById(req.body._id, function(err, truck) {
			if (err) res.status(500).send(err);
			else {
				if (truck.favorites < 0) truck.favorites = 0;
				truck.favorites++;
				truck.save(function(err, result) {
					if (err) res.status(500).send(err);
					else res.send(result);
				})
			}
		})
	},
	removeFavFromTruck: function(req, res, next) {
		Truck.findOne({_id: req.body._id}, function(err, truck) {
			if (err) res.status(500).send(err);
			else {
				truck.favorites--;
				if (truck.favorites < 0) truck.favorites = 0;
				truck.save(function(err, result) {
					if (err) res.status(500).send(err);
					else res.send(result);
				})
			}
		})
	},
	getOnlineTrucks: function(req, res, next) {
		var onlineTruckArray = [];
		Truck.find({}).populate('specials').exec(function(err, trucks) {
			if (err) res.status(500).send(err);
			else {
				var options = {
					path: 'specials.truckRef',
					models: 'truckRef'
				}
				Truck.populate(trucks, options, function(err, result) {
					for (var i = 0; i < trucks.length; i++) {
						if (trucks[i].online === true) {
							onlineTruckArray.push(trucks[i]);
						}
					}
					res.send(onlineTruckArray);
				})
			}
		})
	}
}