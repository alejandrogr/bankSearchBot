const makeResponse = (res) => {
	console.log(res)
	const responseData = {
		lat: null,
		lng: null,
		name: null,
		vicinity: null
	}

	if( res && res.json && res.json.results && res.json.results.length > 0 ){
		var firstRes = res.json.results[0]
		console.log( 'find result', firstRes )
		var resLoc = firstRes.geometry.location
		responseData.lat = resLoc.lat
		responseData.lng = resLoc.lng
		responseData.name = firstRes.name
		responseData.vicinity = firstRes.vicinity || firstRes.formatted_address
	}
	return responseData
}

const requestCallback = (err, res, callback) => {
	console.log('received response from google API')
	if( err ){
		console.log('ERROR ', err)
		callback(err)
	} else {
		const responseData = makeResponse(res)
		callback( null, responseData )
	}
}

exports.searchNearByLoc = function(key, lat, lng, type, keyword, callback){
	var opts = {
		keyword: keyword,
		type: type,
		location: [lat, lng],
		rankby: 'distance'
	}

	var googleMapsClient = require('@google/maps').createClient({
		key: key
	});

	console.log('Request to geocode google maps API', opts)
	googleMapsClient.placesNearby(
		opts,
		function(err, res){
			requestCallback(err, res, callback)
		}
	)
}

exports.searchNearByAddress = function(key, address, type, keyword, callback){
	var opts = {
		query: keyword + ' near ' + address,
		type,
	}

	var googleMapsClient = require('@google/maps').createClient({
		key: key
	});

	console.log('Request to geocode google maps API', opts)
	googleMapsClient.places(
		opts,
		function(err, res){
			requestCallback(err, res, callback)
		}
	)
}

