const express = require("express");
const https = require("https"); //allowa us to make https requests
const bodyParser = require("body-parser");



const app = express();


app.set ("view engine", "ejs");

//var names for API 
var weatherForecast = "";
var cityTime = ""
var city = "";
var weatherIcon = "";
var bgColor = "bg-sunny";
var units = "imperial";



app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));


//root route or homepage
app.get("/", function(req, res) {

  //renders html.ejs when homepage is accessed
  res.render("html", 
  {
    weatherUpdateText: weatherForecast, 
    localCityDate: cityTime, 
    cityName: city,
    iconURL: weatherIcon,
    bgClass: bgColor,


  })




  
});


app.post("/", function(req, res) {

  
  city = req.body.cityName;

  //API key for app
  const apiKey = "454ffd364037174fbfcba17cda7d6fde";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + units;


  //https get request fetches data from API 'url' 
  https.get(url, function(response) {
    console.log(response.statusCode);

    //response.on is called when it receives data
    //data is passed into function
    response.on("data", function(data) {

      

      if (response.statusCode === 200) {

        //converted JSON to JS Object stored in const weatherData
        //JSON.stringify(object) converts JS into string
        const weatherData = JSON.parse(data);

        const description = weatherData.weather[0].description;
        const temp = weatherData.main.temp;
        const icon = weatherData.weather[0].icon;

        //constants representing data from converted JS Object
        //represents path to city timezone
        const timezone = weatherData.timezone; 

        const dt = weatherData.dt;
        const cityNames = weatherData.name;

        console.log(cityNames);
        cityTime = new Date(dt*1000+(timezone*1000));

        console.log(weatherData);
        console.log(description);

        var isDay = icon.includes("d");
        console.log(icon);
        console.log(isDay);

        // checks if daytime or night
        if (isDay == true) {
          bgColor = "bg-sunny"
        } else {
          bgColor = "bg-night"
        }

        
        console.log(bgColor);
        // weatherIcon = "http://openweathermap.org/img/wn/" +icon + "@2x.png";

        //
        weatherIcon = "images/" +icon + ".gif";
        console.log(weatherIcon);
        weatherForecast = "The weather is showing " + description + "\n"
        + "with a temperature of " + temp + "° F.";

      } else {

        weatherForecast = "Error: You may have entered an invalid city, Please try again.";
      }

      res.redirect("/");
      // res.write("<h1>The weather in " + city + " is showing " + description + "\n"
      // + "with a temperature of " + temp + "° celsius</h1>");
      // res.write("<img src=" + imageURL + ">");
      // res.send();
    });


  });


})



app.listen(3000, function() {
  console.log("Server running on port 3000");
});
