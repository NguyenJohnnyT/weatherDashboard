/**
 * 1. User inputs a city.  Assign it to a variable `city`. [to be used for fetch and obtain lat/lon]
 * 2. Assign fiveDayAPI to a string 'https://api.openweathermap.org/data/2.5/forecast?q='
 * 3. Assign fiveDayURL to fiveDayAPI concat with apiKey
 * 4. Fetch (fiveDayURL) and obtain values for lat, lon.  Assign to lat & lon respectively using x.city.coord['lat' or 'lon']. [obtain lat and lon for one call API cause they only use lon lat]
 * 5. Assign oneAPI to 'https://api.openweathermap.org/data/2.5/onecall?lat='
 * 6. Assign oneURL to oneAPI concat with (lat, '&lon=', lon, apiKey).
 * 7. Fetch oneURL and obtain key values for the currentday: dt (unix time), temp[day], humidity, wind_speed, uvi [We need these to display to user]
 * 8. Also from fetch oneURL, obtain for the next 5 days: dt, temp[day], humidity [For the cards 5 day forecast]
 * 9. Convert dt into MM, DD, YYYY [So we can give the user human dates]
 * 10. Assign key values to appropriate elements and append them to the HTML [display final information to the user]
 **/

cityInput = 'Fremont'
apiKey = '&units=imperial&appid=04b224ea6e7cb3656cbadc58a9e5d125'

fiveDayAPI = 'https://api.openweathermap.org/data/2.5/forecast?q='
fiveDayURL = fiveDayAPI.concat(cityInput, apiKey);

// var fetchedWeather = await fetchLatLon(fiveDayURL)
// console.log(fetchedWeather);

const fetchLatLon = async function (url) {
    fetch(url)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        // console.log(data);
        console.log(data.city.coord['lat'])
        lat = data.city.coord['lat'];
        lon = data.city.coord['lon'];
        // fetchData (lat, lon)
        return [lat, lon]
    })
}

//from fiveDayURL, need to grab lat and longitude so we can get currentDayURL.
function fetchData (latLon) {
    var oneAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat='
    oneURL = oneAPI.concat(latLon[0], '&lon=', latLon[1], apiKey);
    fetch(oneURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log(data);
            var currentWeather = currentDay(data);
            var fiveDayForecast = forecastData(data);
            console.log(currentWeather);
            console.log(fiveDayForecast);
            return [currentWeather, fiveDayForecast]
        })
}

function currentDay(data) {
    //dt, temp[day], humidity, wind_speed, uvi, weather general
    var dt = data.current['dt']*1000
    var currentTime = moment(dt).format('MMMM Do, YYYY')
    return {
        'date': currentTime,
        'temp': data.current['temp'],
        'humidity': data.current['humidity'],
        'windSpeed': data.current['wind_speed'],
        'uvIndex': data.current['uvi'],
        'weather': data.current.weather[0]['main'],
        'emoji': '',
    }
}

function forecastData(data) {
    //dt, temp[day], humidity, weather general
    var forecastArr = []
    for (i=1; i < 6; i++) {
        object = {};
        var dt = data.daily[i]['dt']*1000;
        var currentTime = moment(dt).format('MMMM Do, YYYY');
        object['date'] = currentTime;
        object['temp'] = data.daily[i].temp['day'];
        object['humidity'] = data.daily[i]['humidity'];
        object['weather'] = data.daily[i].weather[0]['main']
        object['emoji'] = ''
        forecastArr.push(object);
    }
    return forecastArr
}

let main = async function () {
    let latLon = await fetchLatLon(fiveDayURL)
    console.log(latLon)
    return latLon
}

let secondary = async function () {
    let weatherArr = await fetchData(latLon)
    return weatherArr
}

main()

// function determineEmoji () { //iterate through the currentDay and forecast objects' 'weather' property to obtain a string value.  Switch case to give the 'emoji' property an emoji string.
//     switch () {
//         case 'clear':
//             ['emoji'] = emojis[0];
//             break;
//         case 'clouds':
//             ['emoji'] = emojis[1];
//             break;
//         case 'drizzle':
//             ['emoji'] = emojis[3]
//             break;
//         case 'rain':
//             ['emoji'] = emojis[4]
//             break;
//         case 'thunderstorm':
//             ['emoji'] = emojis[5]
//             break;
//         case 'snow':
//             ['emoji'] = emojis[6]
//             break;
//         case 'fog':
//             ['emoji'] = emojis[7]
//             break;
//     }
// }

emojis = [ //values from main:
    '☀️', //clear 0
    '⛅', //clouds 1
    '☁️', //clouds 2
    '🌦', //drizzle 3
    '🌧', //rain 4
    '🌩', //thunderstorm 5
    '❄️', //snow 6
    '🌫', //fog 7
]


