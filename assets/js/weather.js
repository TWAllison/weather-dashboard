var currentWeather = $("#current-weather")

var apiKey = "a6b61b1b7f92f9c968b0e70a23502785"
//var cityName = "Reno"

$("#search-btn").on("click", function() {
    if (!$(this).siblings("input").val()) {
        alert("Enter a city Name")
        return
    } else {
        var cityName = $(this).siblings("input").val()
    }

    fetchWeatherData(cityName)
});

var fetchWeatherData = function (cityName) {
    console.log(cityName);


    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                })
            }
        });

};