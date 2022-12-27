const img = document.querySelector('img');
const key = '302b86a74c428853492177eb855f5e89';
const city = 'New York'
let lat, lon

getCoordinates("Morelia");

const btnSearch = document.querySelector(".search-btn")
const searchBar = document.querySelector(".search-bar")


searchBar.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        btnSearch.click();
        event.preventDefault();
    }
  });


btnSearch.addEventListener("click", function() {
    const result = document.querySelector(".search-bar")
    if (result.value != "") {
        getCoordinates(result.value)
        result.value = ""
    } else {
        console.log("error")
    }
})

async function getCoordinates(test) {
    const response = await fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + test + '&limit=1&appid=302b86a74c428853492177eb855f5e89', {
        mode: 'cors'
    })
    const weatherData = await response.json();
    lat = weatherData[0].lat;
    lon = weatherData[0].lon;
    getData();
}

async function getData() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + key + '&units=metric', {
        mode: 'cors'
    })
    const weatherData = await response.json();
    // console.log(weatherData)
    // console.log(weatherData.main.humidity)
    showInfo(weatherData)
    forecastData();
}

async function showInfo(response) {

    let sunrise = changeTime(response.sys.sunrise)
    let sunset = changeTime(response.sys.sunset)
    document.querySelector(".img-content").src = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
    document.querySelector('.temperature-text').innerHTML = Math.round(response.main.temp) + "°C"
    document.querySelector('.city-text').innerHTML = response.name
    document.querySelector('.weather-description').innerHTML = response.weather[0].description
    document.querySelector('.sunrise-info').innerHTML = sunrise
    document.querySelector('.sunset-info').innerHTML = sunset
    document.querySelector('.humidity-info').innerHTML = response.main.humidity + "%"
    document.querySelector('.wind-info').innerHTML = response.wind.speed + " km/h"
    document.querySelector('.feels-info').innerHTML = Math.round(response.main.feels_like) + "°C"
    const delay = ms => new Promise(res => setTimeout(res, ms));
    startLoader()
    await delay(500)
    stopLoader()
}

function changeTime(time) {
    let date = new Date(time * 1000);
    const dateConverted = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: false });
    return dateConverted;

}

async function forecastData() {
    const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + key + '&cnt=5' + '&units=metric', {
        mode: 'cors'
    })
    const weatherData = await response.json();
    loadForecast(weatherData)
}

function loadForecast(weatherData) {

    loadDays()
    const cards = document.querySelectorAll('.temperature-text-card')
    let i = 0,
        j = 0;
    cards.forEach(card => {
        card.innerHTML = Math.round(weatherData.list[i].main.temp) + "°C"
        i++;
    });

    const temp = document.querySelectorAll(".img-content-card")
    temp.forEach(tem => {
        tem.src = "http://openweathermap.org/img/wn/" + weatherData.list[j].weather[0].icon + ".png"
        j++
    })
}

function loadDays() {


    let i = 1;


    const days = document.querySelectorAll(".days")

    days.forEach(day => {
        const day1 = new Date()
        const day2 = new Date(day1)
        day2.setDate(day2.getDate() + i)
        const date = day2.toLocaleString('en-us', { weekday: 'long' })
        day.innerHTML = date
        i++
    })
}

function stopLoader() {
    const loader = document.querySelector(".loader-wrapper")
    loader.style.display = "none"
}
function startLoader(){
    const loader = document.querySelector(".loader-wrapper")
    loader.style.display = "flex"
}