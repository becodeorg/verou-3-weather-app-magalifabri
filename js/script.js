// IMPORTS

import dummyOneCallAPIData from "./dummyOneCallAPIData.js";
import { createCurrentWeatherDiv } from "./current-weather.js";
import { createComingDaysSection } from "./coming-days.js";

// GLOBAL VARIABLES

const comingDaysDiv = document.querySelector(".coming-days");
const APIkey = "be9f3e7fb99ef3d5a6cdca04ec93f7de";
const useDummyOneCallAPIData = false;
export const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]
const searchInput = document.querySelector(".search-input");

// EVENT LISTENERS

document.querySelector(".search-button").addEventListener("click", fetch5day3hourAPIData);
window.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        fetch5day3hourAPIData();
    }
});

searchInput.addEventListener("focus", () => {
    const cursor = document.querySelector(".cursor");
    const lookingGlassImg = document.querySelector(".search-button img");
    
    cursor.style.display = "none";
    lookingGlassImg.style.opacity = "1";
})
searchInput.addEventListener("blur", () => {
    const cursor = document.querySelector(".cursor");
    const lookingGlassImg = document.querySelector(".search-button img");
    
    cursor.style.display = "inline";
    lookingGlassImg.style.opacity = ".5";
})

window.addEventListener("scroll", () => {
    const scrolledPx = window.scrollY;
    const background = document.querySelector(".background");
    background.style.top = - (scrolledPx * .5) + "px";
})


// FUNCTIONS

// run search without triggering an event to not start with an empty page
fetch5day3hourAPIData();

function fetch5day3hourAPIData() {
    removeWeekSection();
    removeErrorMessage();
    const searchedLocation = searchInput.value;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchedLocation}&units=metric&appid=${APIkey}`)
        .then(response => response.json())
        .then(weatherData => (parse5day3hourAPIData(weatherData)));
};

function removeWeekSection() {
    const days = document.querySelectorAll(".day");
    
    for (const day of days) {
        if (day.classList.contains("template")) {
            continue ;
        }
        day.remove();
    }
}

function removeErrorMessage() {
    const errorMessageP = document.querySelector(".error-message");

    if (errorMessageP) {
        errorMessageP.remove();
        const mainElem = document.querySelector("main");
        mainElem.style.display = "block";
    }
}

function parse5day3hourAPIData(weatherData) {
    if (weatherData.cod !== "200") {
        showErrorMsg(weatherData.message);
        return ;
    }

    fetchOneCallAPIData(weatherData);

    const todaysDate = new Date().getDate();
    const parsedData = [];

    for (const listItem of weatherData.list) {
        // skip over listItems pertaining to today
        const listItemsDate = listItem.dt_txt.slice(8, 10)
        if (todaysDate == listItemsDate) {
            continue ;
        }

        const item = {};
        item["summary"] = listItem.weather[0].main;
        item["description"] = listItem.weather[0].description;
        item["dateObject"] = new Date(listItem.dt * 1000);
        item["temperature"] = listItem.main.temp;
        item["humidity"] = listItem.main.humidity;
        item["clouds"] = listItem.clouds.all;
        item["precip"] = listItem.pop;
        item["iconName"] = listItem.weather[0].icon;
        item["wind-speed"] = listItem.wind.speed; // meter/sec
        parsedData.push(item);
    }

    createComingDaysSection(parsedData);
}

function showErrorMsg(msg) {
    const errorMsg = document.createElement("p");
    errorMsg.classList.add("error-message");
    errorMsg.textContent = msg;
    
    document.body.insertBefore(errorMsg, document.body.children[2]);
    
    const mainElem = document.querySelector("main");
    mainElem.style.display = "none";
}

function fetchOneCallAPIData(weatherData) {
    if (useDummyOneCallAPIData) {
        parseOneCallAPIData(dummyOneCallAPIData);
    } else {
        const lat = weatherData.city.coord.lat;
        const lon = weatherData.city.coord.lon;
    
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`)
            .then(response => response.json())
            .then(weatherData => (parseOneCallAPIData(weatherData)));
    }
}

function parseOneCallAPIData(weatherData) {
    const currentWeatherData = [];
    
    currentWeatherData["summary"] = weatherData.current.weather[0].main;
    currentWeatherData["description"] = weatherData.current.weather[0].description;
    currentWeatherData["dateObject"] = new Date(weatherData.current.dt * 1000);
    currentWeatherData["temperature"] = weatherData.current.temp;
    currentWeatherData["humidity"] = weatherData.current.humidity;
    currentWeatherData["precip"] = weatherData.current.pop;
    currentWeatherData["iconName"] = weatherData.current.weather[0].icon;
    currentWeatherData["wind-speed"] = weatherData.current.wind_speed; // meter/sec
    
    createCurrentWeatherDiv(currentWeatherData, weatherData);
}
