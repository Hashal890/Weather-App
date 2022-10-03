let logo = document.querySelector("#nav>img");
logo.addEventListener("click", function () {
  location.reload();
});

const apiKey = "83f21db20d1689866f556daf1610702d";
let mainDiv = document.getElementById("container");

async function getDefaultLocation(latitude, longitude) {
  let city = document.getElementById("city").value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  // console.log(url);
  // fetch(url).then(function(res){
  //     return res.json();
  // }).then(function(res){
  //     console.log(res);
  // }).catch(function(err){
  //     console.log(err);
  // });
  let res = await fetch(url);
  let data = await res.json();
  console.log(data);
  displayData(data);
  weeklyData(data.coord.lat, data.coord.lon);
}

function displayData(data) {
  mainDiv.innerHTML = "";
  let name = document.createElement("h1");
  name.innerText = data.name;
  let temp = document.createElement("h3");
  temp.innerText = `Current temperature:- ${data.main.temp}°C`;
  let tempmax = document.createElement("h3");
  tempmax.innerText = `Maximum temperature:- ${data.main.temp_max}°C`;
  let tempmin = document.createElement("h3");
  tempmin.innerText = `Minimum temperature:- ${data.main.temp_min}°C`;
  let wind = document.createElement("h3");
  wind.innerText = `Wind data:- { Speed:- ${data.wind.speed} , Deg:- ${data.wind.deg} }`;
  let sunrise = document.createElement("h3");
  sunrise.innerText = `Sunrise:- ${data.sys.sunrise}`;
  let sunset = document.createElement("h3");
  sunset.innerText = `Sunset:- ${data.sys.sunset}`;
  let div = document.createElement("div");
  div.append(name, temp, tempmax, tempmin, wind, sunrise, sunset);
  mainDiv.append(div);

  let iframe = document.getElementById("gmap_canvas");
  iframe.src = `https://maps.google.com/maps?q=${data.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  let city = (document.getElementById("city").value = "");
}

function getLiveLocation() {
  const option = {
    enableHighAccuracy: true,
    timeout: 27000,
  };
  navigator.geolocation.getCurrentPosition(success, Error, option);
  async function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // console.log(latitude);
    // console.log(longitude);
    // getDefaultLocation(latitude,longitude);
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    let res = await fetch(url);
    let data = await res.json();
    // console.log(data);
    displayData(data);
    weeklyData(latitude, longitude);
  }
  function Error() {
    alert("Could not get your live location!");
  }
}

let weeklyDiv = document.getElementById("weeklyData");
async function weeklyData(latitude, longitude) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely&appid=${apiKey}&units=metric`;
  let res = await fetch(url);
  let data = await res.json();
  // console.log(data.daily);
  weeklyDiv.innerHTML = null;
  data.daily.forEach(function (el) {
    let timestamp = el.dt;
    let a = new Date(timestamp * 1000);
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let dayOfWeek = days[a.getDay()];
    // console.log(dayOfWeek);
    let day = document.createElement("h2");
    day.innerText = dayOfWeek;
    let image = document.createElement("img");
    image.src = "./assets/weather-app.png";
    let tempmax = document.createElement("p");
    tempmax.innerText = `Maximum temperature:- ${el.temp.max}°C`;
    let tempmin = document.createElement("p");
    tempmin.innerText = `Minimum temperature:- ${el.temp.min}°C`;
    let div = document.createElement("div");
    div.append(day, image, tempmax, tempmin);
    weeklyDiv.append(div);
  });
}

// daily: Array(8)
// 0: {dt: 1653633000, sunrise: 1653609312, sunset: 1653658896, moonrise: 1653602160, moonset: 1653649020, …}
// 1: {dt: 1653719400, sunrise: 1653695693, sunset: 1653745329, moonrise: 1653690360, moonset: 1653738780, …}
// 2: {dt: 1653805800, sunrise: 1653782076, sunset: 1653831762, moonrise: 1653778740, moonset: 1653828600, …}
// 3: {dt: 1653892200, sunrise: 1653868460, sunset: 1653918194, moonrise: 1653867300, moonset: 1653918420, …}
// 4: {dt: 1653978600, sunrise: 1653954845, sunset: 1654004626, moonrise: 1653956100, moonset: 1654008120, …}
// 5: {dt: 1654065000, sunrise: 1654041231, sunset: 1654091057, moonrise: 1654045200, moonset: 1654097760, …}
// 6: {dt: 1654151400, sunrise: 1654127619, sunset: 1654177487, moonrise: 1654134600, moonset: 1654187160, …}
// 7: {dt: 1654237800, sunrise: 1654214008, sunset: 1654263917, moonrise: 1654224120, moonset: 1654276260, …}
// length: 8
// iframe:-  src="https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
