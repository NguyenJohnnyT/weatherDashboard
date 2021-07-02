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
 */





cityInput = 'Fremont'
apiKey = '&units=imperial&appid=04b224ea6e7cb3656cbadc58a9e5d125'


fiveDayAPI = 'https://api.openweathermap.org/data/2.5/forecast?q='
fiveDayURL = fiveDayAPI.concat(cityInput, apiKey);

function fetchLatLon (url) {
    fetch(url)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        console.log(data.city.coord['lat'])
        lat = data.city.coord['lat'];
        lon = data.city.coord['lon'];
        fetchData (lat, lon)
    })
}


//from fiveDayURL, need to grab lat and longitude so we can get currentDayURL.
function fetchData (lat, lon) {
    var oneAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat='
    oneURL = oneAPI.concat(lat, '&lon=', lon, '&appid=04b224ea6e7cb3656cbadc58a9e5d125');
    fetch(oneURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
        })
}

fetchLatLon(fiveDayURL)