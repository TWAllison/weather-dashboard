var weatherEl = $("#current-weather");
var fiveDayEl = $("#five-day");
var fiveDayHeaderEl = $("#five-day-header");
var searchHistory = JSON.parse(localStorage.getItem("city")) || [];
var searchList = $("#search-list");
var apiKey = "a6b61b1b7f92f9c968b0e70a23502785"
//var cityName = "Reno"

$(document).on("click", ".btn-secondary", function (e) { // takes value from click on secondary buttons and passes to fetchWeatherData function
    console.log("button clicked")
    cityName = ($(this).text())
    fetchWeatherData(cityName)
    console.log(cityName);
});

$("#search-btn").on("click", function () {  // listen for click on search btn then takes sibling data value (input-form) and sets value to cityName
    if (!$(this).siblings("input").val()) {
        alert("Enter a city Name")
        return
    } else {
        var cityName = $(this).siblings("input").val() // set the value from the input form as the var cityName

        if (localStorage.getItem("city") === null) { // save the value of cityName to local storage in an array 
            localStorage.setItem("city", '[]');
        }

        var searchHistory = JSON.parse(localStorage.getItem("city"));
        searchHistory.push(cityName);

        localStorage.setItem("city", JSON.stringify(searchHistory));
    }

    fetchWeatherData(cityName) // pass cityName created from form input to fetch function

});

var fetchWeatherData = function (cityName) {
    console.log(cityName);

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    currentWeather(data);
                    fiveDay(data);
                })
            }
        });
};

var currentWeather = function (weather) {

    var cityLat = weather.city.coord.lat
    var cityLon = weather.city.coord.lon

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    weatherEl.empty(); // clears current weather box to prevent more than one being created

                    var cityTitle = document.createElement("h2")
                    cityTitle.textContent = weather.city.name + "(" + moment.unix(weather.list[0].dt).format("MMM DD, YYYY") + ")"; // take data returned at index 0 (current hour) 

                    var forecastIcon = document.createElement("img")
                    forecastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`)

                    cityTitle.append(forecastIcon) // append current weather icon to title
                    weatherEl.append(cityTitle) // append the title to the weatherEL on page (with added icon)

                    var cityTemp = document.createElement("p")
                    cityTemp.textContent = "Temp: " + weather.list[0].main.temp + "°F"
                    weatherEl.append(cityTemp)

                    var cityWind = document.createElement("p")
                    cityWind.textContent = "Wind: " + weather.list[0].wind.speed + "MPH"
                    weatherEl.append(cityWind)

                    var cityHumidity = document.createElement("p")
                    cityHumidity.textContent = "Humidity: " + weather.list[0].main.humidity + "%"
                    weatherEl.append(cityHumidity)

                    var cityUvText = document.createElement("p")
                    var cityUvContainer = document.createElement("span")
                    cityUv = data.current.uvi                   //create two elements to allow for a colored background 
                    cityUvContainer.textContent = cityUv
                    cityUvText.textContent = "UV Index: "
                    cityUvText.append(cityUvContainer)
                    weatherEl.append(cityUvText)

                    if (cityUv <= 4) {
                        $(cityUvContainer).addClass("bg-success fs-4");  // use the UV index to determine the background color and assign boostrap class accordingly 
                    } else if (cityUv <= 7 && cityUv > 4) {
                        $(cityUvContainer).addClass("bg-warning fs-4");
                    } else if (cityUv <= 10 && cityUv > 7) {
                        $(cityUvContainer).addClass("bg-danger fs-4");
                    }
                })
            }
        });
}

var fiveDay = function (weather) {
    fiveDayEl.empty();
    document.querySelector("#five-day-header").textContent = "5 Day Forcast";

    fiveDayEl.empty();

    // create a loop
    for (i = 5; i < weather.list.length; i = i + 8) {
        var fiveDayCard = document.createElement("div")
        fiveDayCard.setAttribute("class", "card col-lg-2 bg-secondary bg-gradient ")

        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(weather.list[i].dt).format("MMM DD, YYYY");
        //forecastDate.addClass("card-header")
        fiveDayCard.append(forecastDate);

        var forecastIcon = document.createElement("img")
        forecastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@2x.png`)
        fiveDayCard.append(forecastIcon)

        var cityTemp = document.createElement("p")
        cityTemp.textContent = "Temp: " + weather.list[i].main.temp + "°F"
        fiveDayCard.append(cityTemp)

        var cityWind = document.createElement("p")
        cityWind.textContent = "Wind: " + weather.list[i].wind.speed + "MPH"
        fiveDayCard.append(cityWind)


        var cityHumidity = document.createElement("p")
        cityHumidity.textContent = "Humidity: " + weather.list[i].main.humidity + "%"
        fiveDayCard.append(cityHumidity)

        fiveDayEl.append(fiveDayCard)
    }
}

var getSearchHistory = function () {

    for (var i = 0; i < searchHistory.length; i++) {
        var listItem = document.createElement("li");
        var secondaryButton = document.createElement("button")
        secondaryButton.textContent = searchHistory[i];
        secondaryButton.setAttribute("class", "btn btn-secondary");
        secondaryButton.setAttribute("type", "button");

        listItem.append(secondaryButton);
        searchList.append(listItem);
    }
};

getSearchHistory();
