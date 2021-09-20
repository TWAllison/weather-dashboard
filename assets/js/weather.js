var weatherEl = $("#current-weather")

var apiKey = "a6b61b1b7f92f9c968b0e70a23502785"
//var cityName = "Reno"



  

$("#search-btn").on("click", function() {  // listen for click on search btn then takes sibling data value (input-form) and sets value to cityName
    if (!$(this).siblings("input").val()) {
        alert("Enter a city Name")
        return
    } else {
        var cityName = $(this).siblings("input").val()
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
                })
            }
        });

};

var currentWeather = function(weather) {

    var cityLat = weather.city.coord.lat
    var cityLon = weather.city.coord.lon

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);


                var cityTitle = document.createElement("h2")
                cityTitle.textContent = weather.city.name + "(" + moment.unix(weather.list[0].dt).format("MMM DD, YYYY") + ")"; // take data returned at index 0 (current hour) 

                var forcastIcon = document.createElement("img")
                forcastIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png` )

                cityTitle.append(forcastIcon) // append current weather icon to title
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

                if (cityUv <= 4 ) {
                    $(cityUvContainer).addClass("bg-success fs-4");  // use the UV index to determine the background color and assign boostrap class accordingly 
                } else if (cityUv <=7 && cityUvi > 4) {
                    $(cityUvContainer).addClass("bg-warning fs-4");
                } else if (cityUv <= 10 && cityUvi > 7) {
                    $(cityUvContainer).addClass("bg-danger fs-4");
                }
            })
        }
    });
}

currentWeather();