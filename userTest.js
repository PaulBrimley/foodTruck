var mongoose = require('mongoose');

var user = new mongoose.Schema({
	userName: {type: 'String'}
})

module.exports = mongoose.model('users', user);