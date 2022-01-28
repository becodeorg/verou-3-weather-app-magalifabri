// IMPORTS

import dummyOneCallAPIData from "./dummyOneCallAPIData.js";
import { createCurrentWeatherDiv } from "./current-weather.js";


// GLOBAL VARIABLES

const wrapperWeekDiv = document.querySelector(".coming-days");

// const APIkey = "be9f3e7fb99ef3d5a6cdca04ec93f7de";
const APIkey = "fffc3391a59ea8cd3c2d9714fe2bab32";

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


// EVENT LISTENERS

document.querySelector(".search-button").addEventListener("click", fetch5day3hourAPIData);
window.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        fetch5day3hourAPIData();
    }
});
const searchInput = document.querySelector(".search-input");
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


// FUNCTIONS

function fetch5day3hourAPIData() {
    resetPage();
    const searchedLocation = searchInput.value;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchedLocation}&appid=${APIkey}`)
        .then(response => response.json())
        .then(weatherData => (parse5day3hourAPIData(weatherData)));
};
// run search without triggering an event to not start with an empty page
fetch5day3hourAPIData();

// fetch5day3hourAPIData() HELPER FUNCTIONS
function resetPage() {
    removeWeekSection();
    removeErrorMessage();
}
// resetPage HELPER FUNCTIONS
function removeWeekSection() {
    const days = wrapperWeekDiv.querySelectorAll(".day");
    
    for (const day of days) {
        day.remove();
    }
}

function removeErrorMessage() {
    const errorMessageP = wrapperWeekDiv.querySelector(".error-message");

    if (errorMessageP) {
        errorMessageP.remove();
    }
}
// END resetPage HELPER FUNCTIONS

// END fetch5day3hourAPIData() HELPER FUNCTIONS


function fetchOneCallAPIData(weatherData) {
    if (useDummyOneCallAPIData) {
        parseOneCallAPIData(dummyOneCallAPIData);
    } else {
        const lat = weatherData.city.coord.lat;
        const lon = weatherData.city.coord.lon;
    
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`)
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

function parse5day3hourAPIData(weatherData) {
    if (weatherData.cod !== "200") {
        showErrorMsg(weatherData.message);
        return ;
    }

    fetchOneCallAPIData(weatherData);

    const parsedData = [];

    for (const listItem of weatherData.list) {
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

    create5day3hourDomElems(parsedData);
}

// parse5day3hourAPIData() HELPER FUNCTIONS
function showErrorMsg(msg) {
    const errorMsg = document.createElement("p");
    errorMsg.classList.add("error-message");
    errorMsg.textContent = msg;
    wrapperWeekDiv.append(errorMsg);
}
// END parse5day3hourAPIData() HELPER FUNCTIONS


function create5day3hourDomElems(parsedData) {
    let lastHandledDay = "";
    let InfoWrapperDiv;

    for (const item of parsedData) {
        const dayOfCurrentItem = daysOfTheWeek[item.dateObject.getDay()];
        // if item pertains to a new day, create new day wrapper
        if (lastHandledDay !== dayOfCurrentItem) {
            lastHandledDay = dayOfCurrentItem;
            
            const dayWrapperDiv = addDay();
            addDayNameToDay(dayOfCurrentItem, dayWrapperDiv);
            InfoWrapperDiv = addInfoWrapperToDay(dayWrapperDiv);
            addInfoIconsWrapperToInfoWrapper(InfoWrapperDiv);
        }

        addTimeSectionToInfoWrapper(item, InfoWrapperDiv);
    }
}
// create5day3hourDomElems() HELPER FUNCTIONS
function addDay() {
    const newDayWrapperDiv = document.createElement("div");
    newDayWrapperDiv.classList.add("day");
    wrapperWeekDiv.append(newDayWrapperDiv);

    return (newDayWrapperDiv);
}

function addDayNameToDay(dayName, newDayWrapperDiv) {
    const dayHeader = document.createElement("h2");
    dayHeader.classList.add("day-name");
    dayHeader.textContent = dayName;
    newDayWrapperDiv.append(dayHeader);
}

function addInfoWrapperToDay(newDayWrapperDiv) {
    const newInfoWrapperDiv = document.createElement("div");
    newInfoWrapperDiv.classList.add("wrapper-info");
    
    newDayWrapperDiv.append(newInfoWrapperDiv);

    return (newInfoWrapperDiv);
}

function addInfoIconsWrapperToInfoWrapper(newInfoWrapperDiv) {
    // insert info icons with tooltip at start of rows
    const newTimeIconWrapperDiv = createIconWithTooltip("./images/info-icons/three-o-clock-clock.png", "time of day", "time");
    const newTempIconWrapperDiv = createIconWithTooltip("./images/info-icons/thermometer.png", "temperature in Celsius", "temp");
    const newPrecipIconsWrapperDiv = createIconWithTooltip("./images/info-icons/rainy.png", "probability of precipitation", "pop");
    const newHumidityIconWrapperDiv = createIconWithTooltip("./images/info-icons/humidity.png", "humidity", "humid");
    const newWindSpeedIconWrapperDiv = createIconWithTooltip("./images/info-icons/wind.png", "wind speed in km/h", "wind");

    // create time section wrapper and insert base data items
    const newInfoIconsWrapperDiv = document.createElement("div");
    newInfoIconsWrapperDiv.classList.add("info-icons-wrapper");
    newInfoIconsWrapperDiv.append(newTimeIconWrapperDiv, newTempIconWrapperDiv, newPrecipIconsWrapperDiv, newHumidityIconWrapperDiv, newWindSpeedIconWrapperDiv);
    // newInfoIconsWrapperDiv.append(newTimeIconWrapperDiv, newTemperatureInfoP, newPrecipitationInfoP, newHumidityInfoP, newWindSpeedInfoP);
    
    // add time section to info wrapper
    newInfoWrapperDiv.append(newInfoIconsWrapperDiv);
}
// addInfoIconsWrapperToInfoWrapper() HELPER FUNCTIONS
function createIconWithTooltip(imgURL, tooltipText, iconWrapperClass) {
    const icon = document.createElement("img");
    icon.classList.add("icon");
    icon.setAttribute("src", imgURL);
    
    const iconWrapperDiv = document.createElement("div");
    iconWrapperDiv.classList.add("icon-wrapper", iconWrapperClass);
    iconWrapperDiv.append(icon);
    addTooltip(iconWrapperDiv, tooltipText);

    return (iconWrapperDiv);
}

function addTooltip(parentElem, tooltipContent) {
    const newTooltip = document.createElement("div");
    newTooltip.classList.add("tooltip");
    newTooltip.textContent = tooltipContent;
    
    parentElem.append(newTooltip);
}
// END addInfoIconsWrapperToInfoWrapper() HELPER FUNCTIONS


function addTimeSectionToInfoWrapper(item, InfoWrapperDiv) {
    // create base data items for time section
    const newTimeP = createP("time", item.dateObject.getHours() + "u");
    const newTempP = createP("temperature", convertKelvinToCelsius(item.temperature) + "°");
    const newPrecipitationP = createP("precipitation", Math.round(item.precip * 100) + "%");
    const newHumidityP = createP("humidity", item.humidity + "%");
    const newWindSpeedP = createP("wind-speed", Math.round(item["wind-speed"] * 3.6));
    const newWeatherIconImg = document.createElement("img");
    newWeatherIconImg.classList.add("weather-icon");
    newWeatherIconImg.setAttribute("src", `./images/weather-icons/${item.iconName}.png`);
    newWeatherIconImg.setAttribute("alt", "icon of " + item.description);

    const newIconImgWrapperDiv = document.createElement("div");
    newIconImgWrapperDiv.classList.add("weather-icon-wrapper");
    newIconImgWrapperDiv.append(newWeatherIconImg);
    addTooltip(newIconImgWrapperDiv, item.description);

    
    // create time section wrapper and insert base data items
    const newTimeSectionDiv = document.createElement("div");
    newTimeSectionDiv.classList.add("time-section");
    newTimeSectionDiv.append(newIconImgWrapperDiv, newTimeP, newTempP, newPrecipitationP, newHumidityP, newWindSpeedP);
    
    // add time section to info wrapper
    InfoWrapperDiv.append(newTimeSectionDiv);
}
// addTimeSectionToInfoWrapper() HELPER FUNCTIONS
function createP(className, content) {
    const newP = document.createElement("p");
    newP.classList.add(className);
    newP.textContent = content;

    return (newP);
}

export function convertKelvinToCelsius(F) {
    return (Math.round(F - 273.15));
}
// END addTimeSectionToInfoWrapper() HELPER FUNCTIONS

// END create5day3hourDomElems() HELPER FUNCTIONS
