/**
 * 1. User inputs a city.  Remove the spaces in between by using .split(" ").join("")  Assign it to a variable `city`.
 * 2. Assign fiveDayAPI to a string 'https://api.openweathermap.org/data/2.5/forecast?q='
 * 3. Assign fiveDayURL to fiveDayAPI concat with apiKey
 * 4. Fetch (fiveDayURL) and obtain values for lat, lon.  Assign to lat & lon respectively.
 * 5. Assign oneAPI to 'https://api.openweathermap.org/data/2.5/onecall?lat='
 * 6. Assign oneURL to oneAPI concat with (lat, '&lon=', lon, apiKey).
 * 7. Fetch oneURL and obtain key values for the currentday: dt (unix time), temp[day], humidity, wind_speed, uvi
 * 8. Also from fetch oneURL, obtain for the next 5 days: dt, temp[day], humidity
 * 9. Convert dt into MM, DD, YYYY
 * 10. Assign key values to appropriate elements and append them to the HTML
 */



// var fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=04b224ea6e7cb3656cbadc58a9e5d125';

apiKey = '&units=imperial&appid=04b224ea6e7cb3656cbadc58a9e5d125'
var lat = 37.5483
var lon = -121.9886

var oneURL = 'https://api.openweathermap.org/data/2.5/onecall?lat='

currentDayURL = oneURL.concat(lat, '&lon=', lon, '&appid=04b224ea6e7cb3656cbadc58a9e5d125');



//from fiveDayURL, need to grab lat and longitude so we can get currentDayURL.
fetch(currentDayURL)
    .then(function (response) {
        console.log(response);
        return response.json()
    })
    .then(function (data) {
        console.log(data);
    })