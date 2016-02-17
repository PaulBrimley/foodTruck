var mongoose = require('mongoose');

var truckSchema = new mongoose.Schema({
	connectedUserRef: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
	enabled: {type: 'Boolean'},
	truckName: {type: 'String'},
	picture: {type: 'String'},
	homeBase: {type: 'String'},
	pastLocationsAndSales: [{
		location: {
			lat: {type: 'Number'},
			lng: {type: 'Number'}
		},
		sales: {type: "number"}
	}],
	menu: [{type: 'String'}],
	typeOfFood: {type: 'String'},
	specials: [{type: mongoose.Schema.Types.ObjectId, ref: 'specials'}],
	online: {type: 'Boolean'},
	currentLocation:  {
		lat: {type: 'Number'},
		lng: {type: 'Number'}
	},
	favorites: {type: 'Number'}
});

module.exports = mongoose.model('foodTrucks', truckSchema);