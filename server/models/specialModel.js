var mongoose = require('mongoose');

var specialSchema = new mongoose.Schema({
	truckRef: {type: mongoose.Schema.Types.ObjectId, ref: 'foodTrucks'},
	special: {type: 'String'}	
});

module.exports = mongoose.model('specials', specialSchema);