var maps = require('./maps.js'),
		config = require('./config.js'),
		telegramBot = require('node-telegram-bot-api')

var mapsKey = config.googleMapsKey
var teleToken = config.telegramToken
var chatId = null

const makeBotResponse = (displayText) => {
	
    const body = {
        displayText,
        speech: displayText,
        data: {},
        contextOut: [],
        source: "lambda"
    }
    
    return {
        "statusCode": 200,
        "headers": {},
        "body": JSON.stringify(body)
    }
}

const searchLocation = (lat, lng, address, bank) => {
  console.log('searchLocation', lat, lng, bank)
	return new Promise( (resolve ,reject) => {
		if( address ){
			maps.searchNearByAddress(mapsKey, address, 'bank', bank, (err, res) => {
				searchLocationCallback(err, res, resolve)
			})
		} else {
			maps.searchNearByLoc(mapsKey, lat, lng, 'bank', bank, (err, res) => {
				searchLocationCallback(err, res, resolve)
			})
		}
	})
}

const searchLocationCallback = (err, res, resolve) => {
	var responseText = ''
	console.log(res)
	if( res && res.name ){
		responseText = 'Here is the nearest office from the provided location: ' + res.vicinity
		
		if( chatId ){
			console.log('sending venue to ' + chatId)
			var bot = new telegramBot(teleToken);
			bot.sendVenue(chatId, res.lat, res.lng, res.name, res.vicinity)
		} else {
			console.log('NO CHAT ID to send venue')
		}

	} else {
		console.log('cannot find places', err)
		responseText = 'Cannot find a location near you. :('
	}
	const apiResponse = makeBotResponse(responseText) 
	console.log(apiResponse)
	resolve(apiResponse)
}

const getChatId = (data) => {
	if( data.data && data.data.message && data.data.message.chat)
		return data.data.message.chat.id

	return null
}

const botResponse = (request) => {
	if( request.metadata && request.metadata.intentName && request.contexts){
		const contextParams = request.contexts[0].parameters
		switch(request.metadata.intentName){
			case 'userLocationAttachment':
				return searchLocation(contextParams.lat, contextParams.lng, null, contextParams.bank)
				break;
			case 'userLocation':
				return searchLocation(null, null, request.resolvedQuery, contextParams.bank)
				break;
			default:
				return Promise.resolve('Opps, we have an error')
		}
	} else {
		return Promise.resolve('Opps, we have an error')
	}

}

const botRequest = (event, context, callback) => {
	console.log('BOT REQUEST ACTION START')
  console.log(event.body)
	const body = JSON.parse(event.body)
	const request = body.result
	console.log(request)
	console.log(request.metadata.intentName)

	chatId = getChatId(body.originalRequest)
	console.log('Chat id from: ' + chatId)

	botResponse(request)
		.then( result => {
			console.log('results', result)
			console.log('BOT REQUEST ACTION END')
			callback(null, result)
		})
		.catch( err => {
			console.log('error', err)
			console.log('BOT REQUEST ACTION END')
			callback(err)
		})


};

exports.handler = botRequest


