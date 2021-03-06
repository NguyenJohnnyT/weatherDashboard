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

var searchedCities = [] //local storage
var apiKey = '&units=imperial&appid=04b224ea6e7cb3656cbadc58a9e5d125'
var emojis = [ //values from main:
    '☀️', //clear 0
    '⛅', //clouds 1
    '☁️', //clouds 2
    '🌦', //drizzle 3
    '🌧', //rain 4
    '🌩', //thunderstorm 5
    '❄️', //snow 6
    '🌫', //fog 7
];

/**********************************************
 * Obtaining weather data.  The function start will fetch data from five day API and one API.  
 * CurrentDay and forecastData will create objects to define weather data from days zero to five (Six days total)
 * Determine Emoji will find the weaher['main'] value for each objecto to determine which emoji will be displayed
 * Functions: start, currentDay, forecastData, determineEmoji
 */
const start = async function (city) {
    var fiveDayAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=';
    var fiveDayURL = fiveDayAPI.concat(city, apiKey);
    var cityName = "";

    //fetchLatLon - obtain latitude and longitudes for fetchData
    const latLon = await fetch(fiveDayURL)
    .then(function (response) {
        if (!response.ok) {
            alert('Not a valid city');
            searchedCities.pop(city);
            saveCities();
            renderCities(searchedCities);
            return
        }
        console.log('response', response);
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        var lat = data.city.coord['lat'];
        var lon = data.city.coord['lon'];
        cityName = data.city['name']
        return [lat,lon]
    });

    //fetchData - obtain weather objects for days 0 to 5
    var oneAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat='
    oneURL = oneAPI.concat(latLon[0], '&lon=', latLon[1], apiKey);
    const weatherObj = await fetch(oneURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        currentWeather = currentDay(data); //object of current day's 
        fiveDayForecast = forecastData(data); //an array of objects
        return [currentWeather, fiveDayForecast]
    });
    finalWeather = determineEmoji(weatherObj); //an array of objects from day 0 to 5
    // console.log('finalWeather', finalWeather);
    constructMainCard(finalWeather, cityName); //generate the current day data
    constructAdditionalCards(finalWeather); //generate the forecast data
    return finalWeather
}

function currentDay(data) {
    //return an object that include weather data for day zero
    //dt, temp[day], humidity, wind_speed, uvi, weather general
    var dt = data.current['dt']*1000;
    var currentTime = moment(dt).format('MMMM Do, YYYY');
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
    //obtain an array of objects that include weather data for days 1-6 (five day forecast)
    //dt, temp[day], humidity, weather general
    var forecastArr = [];
    for (i=1; i < 6; i++) {
        object = {};
        var dt = data.daily[i]['dt']*1000;
        var currentTime = moment(dt).format('MMMM Do, YYYY');
        object['date'] = currentTime;
        object['temp'] = data.daily[i].temp['day'];
        object['humidity'] = data.daily[i]['humidity'];
        object['weather'] = data.daily[i].weather[0]['main'];
        object['emoji'] = '';
        forecastArr.push(object);
    }
    return forecastArr
}

function determineEmoji (arr) { //iterate through the currentDay and forecast objects' 'weather' property to obtain a string value.  Switch case to give the 'emoji' property an emoji string.
    var temp1 = [arr[0]]; //put current weather in an array
    var temp2 = arr[1]; //put the array of forecast objects into another array
    var finalArray = temp1.concat(temp2); //concat array of objects into one 'final' array
    // console.log('finalArray', finalArray);
    for (i=0; i<finalArray.length; i++) {
        switch (finalArray[i]['weather'].toLowerCase()) {
            // case 'clear':
            //     finalArray[i]['emoji'] = emojis[0];
            //     break;
            case 'clouds':
                finalArray[i]['emoji'] = emojis[1];
                break;
            case 'drizzle':
                finalArray[i]['emoji'] = emojis[3];
                break;
            case 'rain':
                finalArray[i]['emoji'] = emojis[4];
                break;
            case 'thunderstorm':
                finalArray[i]['emoji'] = emojis[5];
                break;
            case 'snow':
                finalArray[i]['emoji'] = emojis[6];
                break;
            case 'fog':
                finalArray[i]['emoji'] = emojis[7];
                break;
            default:
                finalArray[i]['emoji'] = emojis[0];
        }
    }
    return finalArray
}

/********************************************** 
 * Displaying weather data and creating elements in the HTML
 * functions: constructMainCard, determineUVFlag, constructAdditionalCards
*/
function constructMainCard (finalArr, city) {
    var dayZeroContainer = $('#dayZero');
    dayZeroContainer.empty();
    var currentDay = finalArr[0]
    var h1El = $('<h1>'); //City name, date, emoji
    var pEl1 = $('<p>'); //temp
    var pEl2 = $('<p>'); //humidity
    var pEl3 = $('<p>'); //wind speed
    var pEl4 = $('<p>'); //uv index header
    var spanUV = $('<span>'); //uv number

    h1El.text(city + ' ' + currentDay['date'] + ' ' + currentDay['emoji']);
    pEl1.text('Temperature (°F): ' + currentDay['temp'])
    pEl2.text('Humidity (%): ' + currentDay['humidity'])
    pEl3.text('Wind Speed (MPH): ' + currentDay['windSpeed'])
    pEl4.text('UV Index: ')

    var flag = determineUVFlag(currentDay['uvIndex']);
    spanUV.text(currentDay['uvIndex']);
    spanUV.addClass('p-2 text-white ' + flag);
    spanUV.appendTo(pEl4);

    dayZeroContainer.append(h1El, pEl1, pEl2, pEl3, pEl4);
}

function determineUVFlag (UV_Index) {
    if (UV_Index < 3) {
        return 'bg-success'
    } else if (UV_Index < 8) {
        return 'bg-warning'
    } else {return 'bg-danger'}
}

function constructAdditionalCards (finalArr) {
    $('#forecastContainer').empty();
    $('#forecastContainer').append("<h4 style='height:20px'> 5-Day Forecast: </h4>");
    for (i=1; i<finalArr.length; i++) { //start from day 1, end at day 5
        var divCardEl = $('<div>'); //create column card
        divCardEl.addClass('col card');
        divCardEl.attr('id', ('forecast' + i));
        
        var cardBodyEl = $('<div>'); //create bootstrap Card element
        cardBodyEl.addClass('Card-body');

        var h5El = $('<h5>'); //create h5 element for the forecast date
        h5El.addClass('card-title');
        h5El.attr('id', ('day' + i + 'Title'));
        h5El.text(finalArr[i]['date']);

        var pEl1 = $('<p>'); //Emoji
        var pEl2 = $('<p>'); //Temp
        var pEl3 = $('<p>'); //Humidity
        pEl1.addClass('card-text');
        pEl2.addClass('card-text');
        pEl3.addClass('card-text');
        pEl1.text(finalArr[i]['emoji']);
        pEl2.text('Temperature (°F): ' + finalArr[i]['temp']);
        pEl3.text('Humidity (%): ' + finalArr[i]['humidity']);

        cardBodyEl.append(h5El, pEl1, pEl2, pEl3) //Append to card element each data input
        divCardEl.append(cardBodyEl) //append to column the card element
        $('#forecastContainer').append(divCardEl) //append the column to the row forecast
    }
}

/******************************************
 * INIT, LOCAL STORAGE
 * Init will initialize the page and render any localstorage the user has.
 * renderCities will show the list on the webpage, saveCities will store the key values of local storage into the localStorage.
 * updateCity will take in a user input and add it to the searchedCities array.
 * clearCities will clear localStorage and set key-value to an empty array.  Also clears  the list out of the webpage.
 * Functions: init, renderCities, saveCities, updateCity, clearCities
 */
function init () {
    var tempLocal = JSON.parse(localStorage.getItem('searchedCities'));
    console.log(tempLocal)
    if (tempLocal !== null) {
        console.log('searchedCities already exists, line 266')
        searchedCities = tempLocal;
    }

    renderCities (searchedCities);
}

function renderCities (cities) { //
    $('.list-group').empty()
    for (var i=cities.length-1; i>=0; i--) {
        newLiEl = $('<button>');
        newLiEl.text(cities[i]);
        newLiEl.attr('type', 'button');
        // newLiEl.attr('id', 'cityHistory');
        newLiEl.addClass('btn btn-secondary');
        newLiEl.appendTo('.list-group');
    }
}

function saveCities () {
    localStorage.setItem('searchedCities', JSON.stringify(searchedCities)); //obtain current array
}

function updateCity (userPrompt) { //when a user searches, check if city already in local storage
    if (!userPrompt) {
        alert('Please enter a city')
        return
    } 
    else{
        var inputCity = userPrompt.trim();
        searchedCities.push(inputCity)//push user city into global array
        saveCities()
    }
    renderCities(searchedCities)
    start(userPrompt)
}

function clearCities() {
    searchedCities = [];
    localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
    renderCities(searchedCities);
}

/******************************************
 * On click events
 * Used for searching for a city and accessing the search history
 */
$('#searchCity').on('click', function () {
    console.log('click!');
    var userInput = $('.form-control').val();
    updateCity(userInput);
}); //updateCity

$('#clearHistory').on('click', function() {
    console.log('click..');
    toDelete = confirm('Are you sure you want to clear the search history?');
    if (toDelete) {
        clearCities();
    }
})

$('#cityHistory').on('click', 'button', function() {
    console.log('click!');
    var city = $(this).text();
    // console.log('line 333', city);
    start(city);
});


//Page initilization
init();