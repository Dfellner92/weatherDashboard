var apiKey = "4e5dbe7db2b5e9c8b47fa40b691443d5";
var city;
var currentConditions = "https://api.openweathermap.org/data/2.5/weather?appid=";
var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?4e5dbe7db2b5e9c8b47fa40b691443d5q={city name},{country code}";
var apiCall = "";
var test;
var searchHistory = 1;
let lat;
let lon;
let userInput = localStorage.getItem("latest item"); 



$(document).ready(function () {

  getWeather(userInput);
  $("#search-input").on("click", function (event) {
    event.preventDefault();
    clear();
    userInput = $("#city-search").val().trim();
    console.log(userInput);
    $("#list").prepend(`<button value=${userInput} class="btn btn-secondary btn-lg btn-block" onclick="getWeather(this.value)">` + userInput + '</button>');
    getWeather(userInput);
  })
})

function clear() {
  $("#current-weather").empty();
  $("#five-day").empty();
};

function getWeather(userInput) {
  var latestEntry = (userInput);
  localStorage.setItem("latest item", latestEntry);  

  apiCall = currentConditions + apiKey + "&q=" + userInput;


  $.ajax({
    url: apiCall,
    method: "GET"
  }).then(async function (response) {
    console.log(response)
    var feelslike = response.main.temp
    feelslike = (feelslike - 273.15) * 1.8 + 32
    feelslike = Math.floor(feelslike)
    var city = response.name;
    var humidity = response.main.humidity;
    var wind = response.wind.speed;
    lat = response.coord.lat;
    lon = response.coord.lon;
    clear();
    $("#current-weather").append('<div class="city">' + city + " " + moment().format("MM/DD/YYYY") + '<span class="test"></span>' + "</div>")
    if (response.weather[0].main === "Clouds") {
      $(".test").html(' <i class="fa fa-cloud"></i>')
    };
    if (response.weather[0].main === "Clear") {
      $(".test").html(' <i class="fas fa-sun"></i>')

    }
    $("#current-weather").append("<div>Temperature(F): " + feelslike + "</div>")
    $("#current-weather").append("<div>Humidity: " + humidity + " %</div>")
    $("#current-weather").append("<div>Wind Speed: " + wind + " MPH</div>")
    getUVI();
  });
};

function getUVI() {

  var queryURL2 = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
  $.ajax({
    url: queryURL2,
    method: "GET",
  }).then(function (res) {
    var uvI = res.value;
    var uvIcolor;

    if (uvI >= 0 && uvI < 3) {
      uvIcolor = "green";
    }
    else if (uvI >= 3 && uvI < 6) {
      uvIcolor = "yellow";
    }
    else if (uvI >= 6 && uvI < 8) {
      uvIcolor = "orange";
    }
    else if (uvI >= 8 && uvI < 10) {
      uvIcolor = "red";
    } else {
      uvIcolor = "violet";
    }
    $("#current-weather").append(`<div id="uvi">UV Index: ${uvI} </div>`);
    $("#uvi").append(`<div class='box ${uvIcolor}'></div>`);
    getFiveDay();
  })
};

function getFiveDay() {

  var queryURL3 = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&appid=${apiKey}`;

  $.ajax({
    url: queryURL3,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    var averageTemp = 0;
    var previousdate = ""
    var count = 0
    var results = 0
    previousdate = moment().format("MM/DD/YYYY")
    for (i = 0; i < response.list.length; i++) {
      var currentDate = moment(response.list[i].dt, "X").format(
        "MM/DD/YYYY"
      )
      var temp = response.list[i].main.temp
      temp = (temp - 273.15) * 1.8 + 32
      temp = Math.floor(temp)
      let humidity = response.list[i].main.humidity;
      console.log(currentDate)
      console.log(temp)

      if (previousdate === currentDate) {
        averageTemp = averageTemp + temp
        count++
        previousdate = currentDate
      } else {
        results = averageTemp / count
        results = Math.floor(results)
        console.log("results:", results)
        var card = $("<div class = 'card m-1 p-1 col-sm-2'>")

        var div1 = $("<div class= 'card-header'>")
        div1.append(currentDate)
        card.append(div1)

        var div2 = $("<div class= 'card-body'>")
        div2.append("Temp: " + results)
        div2.append("Hmdty: " + humidity);
        card.append(div2)

        $("#five-day").append(card)

        count = 0
        averageTemp = 0
        previousdate = currentDate
      }
    };
  });

};

//function getFiveDay
//     $("#list").each(function() {  
//         localStorage.setItem(searchHistory, city); 
//         searchHistory++;   
//         for (i = 1; i < localStorage.length + 1; i++) {
//           $("#list").prepend(`<button type="button" class="btn btn-secondary btn-lg btn-block" id=${i}>` + city + '</button>')
//           };   
//     });

//     $('.btn').on('click', function(){
//       $('button[type="button"]').each(function(){    
//           var id = $(this).text();
//           getWeather(id);                    
//       }); 
//   });
