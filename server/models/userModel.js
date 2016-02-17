var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	q = require('q');

var userSchema = new mongoose.Schema({
	userName: {type: 'String'},
	email: {type: 'String', unique: true},
	password: {type: 'String'},
	facebookId: {type: 'String'},
	permissions: [{type: 'String', enum: ['Admin', 'FoodTruck', 'User']}],
	favoriteTrucks: [{type: mongoose.Schema.Types.ObjectId, ref: 'foodTrucks'}],
	connectedTruckRef: {type: mongoose.Schema.Types.ObjectId, ref: 'foodTrucks'}
});

userSchema.methods.generateHash = function (password) {
	var dfd = q.defer();
	bcrypt.genSalt(10, function (err, salt) {
		if (err) {
			dfd.reject(err);
		}
		bcrypt.hash(password, salt, null, function (err, hash) {
			password = hash;
			dfd.resolve(password);
		});
	});
	return dfd.promise;
};

userSchema.methods.validPassword = function (password) {
	var dfd = q.defer();

	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) {
			dfd.reject(err);
		}
		else {
			dfd.resolve(isMatch);
		}
	});
	return dfd.promise;
};

module.exports = mongoose.model('users', userSchema);