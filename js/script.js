// IMPORTS

import dummyOneCallAPIData from "./dummyOneCallAPIData.js";


// GLOBAL VARIABLES

const wrapperWeekDiv = document.querySelector(".coming-days");

// const APIkey = "be9f3e7fb99ef3d5a6cdca04ec93f7de";
const APIkey = "fffc3391a59ea8cd3c2d9714fe2bab32";

const useDummyOneCallAPIData = true;

const daysOfTheWeek = [
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



const currentWeatherDOMElems = {
    summaryP: document.querySelector(".summary"),
    
    bigWeatherIcon: document.querySelector(".big-weather-icon"),
    bigTemperatureNumber: document.querySelector(".big-temperature-number"),
    
    precipitationLi: document.querySelector(".data-list .precipitation"),
    humidityLi: document.querySelector(".data-list .humidity"),
    windLi: document.querySelector(".data-list .wind"),
    
    temperatureChart: document.querySelector(".chart.temperature"),
    precipitationChart: document.querySelector(".chart.precipitation"),

    temperatureChartButton: document.querySelector(".temperature-chart-button"),
    precipitationChartButton: document.querySelector(".precipitation-chart-button"),
}
// console.log(currentWeatherDOMElems);

function createCurrentWeatherDiv(currentWeatherData, allWeatherData) {
    fillSummaryP(currentWeatherData);
    fillMainDataDiv(currentWeatherData);
    drawTemperatureChart(allWeatherData);
    drawPrecipitationChart(allWeatherData);

    currentWeatherDOMElems.temperatureChartButton.addEventListener("click", switchCharts);
    currentWeatherDOMElems.precipitationChartButton.addEventListener("click", switchCharts);
}
// createCurrentWeatherDiv() HELPER FUNCTIONS
function fillSummaryP(data) {
    const day = daysOfTheWeek[data.dateObject.getDay()];
    const hours = data.dateObject.getHours();
    let minutes = data.dateObject.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    const description = data.description;
    
    currentWeatherDOMElems.summaryP.textContent = `${day} ${hours}:${minutes}, ${description}`;
}

function fillMainDataDiv(data) {
    currentWeatherDOMElems.bigWeatherIcon.setAttribute("src", `./images/weather-icons/${data.iconName}.png`);
    currentWeatherDOMElems.bigWeatherIcon.setAttribute("alt", "icon of " + data.description);
    
    currentWeatherDOMElems.bigTemperatureNumber.innerHTML = `${convertKelvinToCelsius(data.temperature)}<sup>°</sup>`

    currentWeatherDOMElems.precipitationLi.textContent = `Precip: ${data.precip | "0"}%`;
    currentWeatherDOMElems.humidityLi.textContent = `Humidity: ${data.humidity}%`;
    currentWeatherDOMElems.windLi.textContent = `Wind: ${Math.round(data["wind-speed"] * 3.6)} km/h`;
}

function drawTemperatureChart(weatherData) {
    const temperatureData = [];
    const timestamps = [];
    
    for (let i = 0; i < 24; i++) {
        temperatureData.push(convertKelvinToCelsius(weatherData.hourly[i].temp));
    }
    for (let i = 0; i < 24; i++) {
        timestamps.push(new Date(weatherData.hourly[i].dt * 1000).getHours() + "h");
    }

    Chart.defaults.font.size = 16;
    Chart.defaults.color = "white";
    Chart.defaults.font.family = "Dosis";
    Chart.defaults.plugins.tooltip.enabled = false;

    const myChart = new Chart(currentWeatherDOMElems.temperatureChart, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                // label: 'temperature',
                data: temperatureData,
                pointRadius: 0, // hide dots on line
                borderColor: "white",
                borderWidth: 2,
                fill: true,
                backgroundColor: "transparent",
                // backgroundColor: gradient, // use created gradient
                tension: 0.3, // make line more curvy
            }]
        },
        options: {
            scales: {
                y: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    beginAtZero: true,
                    ticks: {
                        // color: "white",
                        size: 20,
                        callback: function(value, index, ticks) {
                            return value + "°C";
                        }, // add "°C" to tick labels
                        // callback: function(val, index) {
                        //     return index % 2 === 0 ? this.getLabelForValue(val) + "°C" : '';
                        // },
                        maxTicksLimit: 4,
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxRotation: 0, // don't rotate tick labels
                        // callback: function(val, index) {
                        //     return index % 4 === 0 ? this.getLabelForValue(val) : '';
                        // }, // only show every 4th tick label
                        // autoSkip: false,
                        maxTicksLimit: 6,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // hide legend
                }
            }
        }
    });
}

function drawPrecipitationChart(weatherData) {
    const precipitationData = [];
    const timestamps = [];
    
    for (let i = 0; i < 24; i++) {
        precipitationData.push(weatherData.hourly[i].pop * 100);
        // console.log(weatherData.hourly[i].pop);
    }
    for (let i = 0; i < 24; i++) {
        timestamps.push(new Date(weatherData.hourly[i].dt * 1000).getHours() + "h");
    }

    const ctx = currentWeatherDOMElems.precipitationChart.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    const myChart = new Chart(currentWeatherDOMElems.precipitationChart, {
        type: 'bar',
        data: {
            labels: timestamps,
            datasets: [{
                barThickness: 10,
                // label: 'temperature',
                data: precipitationData,
                pointRadius: 0, // hide dots on line
                // borderColor: "rgba(255, 249, 230)",
                // borderWidth: 3,
                fill: true,
                backgroundColor: gradient, // use created gradient
                // backgroundColor: "white",
                tension: 0.3, // make line more curvy
            }]
        },
        options: {
            scales: {
                y: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, ticks) {
                            return value + "%";
                        }, // add "°C" to tick labels
                        // callback: function(val, index) {
                        //     return index % 2 === 0 ? this.getLabelForValue(val) + "%" : '';
                        // },
                        maxTicksLimit: 4,
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        maxRotation: 0, // don't rotate tick labels
                        // callback: function(val, index) {
                        //     return index % 4 === 0 ? this.getLabelForValue(val) : '';
                        // }, // only show every 4th tick label
                        // autoSkip: false,
                        maxTicksLimit: 6,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // hide legend
                }
            }
        }
    });
}

function switchCharts(event) {
    currentWeatherDOMElems.temperatureChart.classList.remove("hidden");
    currentWeatherDOMElems.precipitationChart.classList.remove("hidden");

    currentWeatherDOMElems.temperatureChartButton.classList.remove("hidden");
    currentWeatherDOMElems.precipitationChartButton.classList.remove("hidden");

    if (event.target.classList[0].includes("temperature")) {
        currentWeatherDOMElems.precipitationChart.classList.add("hidden");
        currentWeatherDOMElems.precipitationChartButton.classList.add("hidden");
    } else {
        currentWeatherDOMElems.temperatureChart.classList.add("hidden");
        currentWeatherDOMElems.temperatureChartButton.classList.add("hidden");
    }
}

// END createCurrentWeatherDiv() HELPER FUNCTIONS



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

function convertKelvinToCelsius(F) {
    return (Math.round(F - 273.15));
}
// END addTimeSectionToInfoWrapper() HELPER FUNCTIONS

// END create5day3hourDomElems() HELPER FUNCTIONS
