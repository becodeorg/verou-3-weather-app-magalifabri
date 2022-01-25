const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const wrapperWeekDiv = document.querySelector(".wrapper-days");
const APIkey = "be9f3e7fb99ef3d5a6cdca04ec93f7de";

const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

searchButton.addEventListener("click", search);
window.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        search();
    }
});

// var bg = $("#bg1, #bg2");

// function resizeBackground() {
//     bg.height($(window).height());
// }

// $(window).resize(resizeBackground);
// resizeBackground();

document.addEventListener('scroll', () => {
    console.log(window.innerHeight);
    document.body.style.backgroundSize = window.innerWidth + "px " + (window.innerHeight + 50) + "px";
});
// document.body.style.backgroundSize = "10px";


function search() {
    clearWrapperWeekDiv();
    const searchedLocation = searchInput.value;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchedLocation}&appid=${APIkey}`)
        .then(response => response.json())
        .then(weatherData => (processData(weatherData)))
};
// run search without triggering an event
search();

// search() HELPER FUNCTIONS
function clearWrapperWeekDiv() {
    const days = wrapperWeekDiv.querySelectorAll(".day");
    for (const day of days) {
        day.remove();
    }

    const errorMsg = wrapperWeekDiv.querySelector(".error-message");
    if (errorMsg) {
        errorMsg.remove();
    }
}
// END search() HELPER FUNCTIONS


function processData(weatherData) {
    if (weatherData.cod !== "200") {
        showErrorMsg(weatherData.message);
        return ;
    }

    const parsedData = [];
    console.log(weatherData);
    for (listItem of weatherData.list) {
        const item = {};
        item["summary"] = listItem.weather[0].main;
        item["description"] = listItem.weather[0].description;
        item["date"] = new Date(listItem.dt * 1000);
        item["temperature"] = listItem.main.temp;
        item["humidity"] = listItem.main.humidity;
        item["clouds"] = listItem.clouds.all;
        item["precip"] = listItem.pop;
        item["iconName"] = listItem.weather[0].icon;
        item["wind-speed"] = listItem.wind.speed; // meter/sec
        parsedData.push(item);
    }

    createDomElems(parsedData);
}

// processData() HELPER FUNCTIONS
function showErrorMsg(msg) {
    const errorMsg = document.createElement("p");
    errorMsg.classList.add("error-message");
    errorMsg.textContent = msg;
    wrapperWeekDiv.append(errorMsg);
}
// END processData() HELPER FUNCTIONS


function createDomElems(parsedData) {
    let lastHandledDay = "";
    let InfoWrapperDiv;

    for (const item of parsedData) {
        const dayOfCurrentItem = daysOfTheWeek[item.date.getDay()];
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

// createDomElems() HELPER FUNCTIONS
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
    const newTimeIconWrapperDiv = createIconWithTooltip("./images/icons/three-o-clock-clock.png", "time of day", "time");
    const newTempIconWrapperDiv = createIconWithTooltip("./images/icons/thermometer.png", "temperature in Celsius", "temp");
    const newPrecipIconsWrapperDiv = createIconWithTooltip("./images/icons/rainy.png", "probability of precipitation", "pop");
    const newHumidityIconWrapperDiv = createIconWithTooltip("./images/icons/humidity.png", "humidity", "humid");
    const newWindSpeedIconWrapperDiv = createIconWithTooltip("./images/icons/wind.png", "wind speed in km/h", "wind");

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
    const newTimeP = createP("time", item.date.getHours() + "u");
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

function convertKelvinToCelsius(F) {
    return (Math.round(F - 273.15));
}
// END addTimeSectionToInfoWrapper() HELPER FUNCTIONS

// END createDomElems() HELPER FUNCTIONS
