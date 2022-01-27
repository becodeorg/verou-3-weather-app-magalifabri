const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const wrapperWeekDiv = document.querySelector(".coming-days");

// const APIkey = "be9f3e7fb99ef3d5a6cdca04ec93f7de";
const APIkey = "fffc3391a59ea8cd3c2d9714fe2bab32";
import dummyOneCallAPIData from "./dummyOneCallAPIData.js";

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

searchButton.addEventListener("click", fetch5day3hourAPIData);
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
    removeCurrentWeatherSection();
    removeWeekSection();
    removeErrorMessage();
}
// resetPage HELPER FUNCTIONS
function removeCurrentWeatherSection() {
    const currentWeatherDiv = document.querySelector(".current-weather");
    const newCurrentWeatherDiv = document.createElement("div");
    const mainElem = document.querySelector("main");
    
    if (currentWeatherDiv.children.length < 4) {
        return ;
    }

    newCurrentWeatherDiv.classList.add("current-weather");
    mainElem.insertBefore(newCurrentWeatherDiv, currentWeatherDiv);
    currentWeatherDiv.remove();
}

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
    const parsedDataCurrent = [];
    
    parsedDataCurrent["summary"] = weatherData.current.weather[0].main;
    parsedDataCurrent["description"] = weatherData.current.weather[0].description;
    parsedDataCurrent["dateObject"] = new Date(weatherData.current.dt * 1000);
    parsedDataCurrent["temperature"] = weatherData.current.temp;
    parsedDataCurrent["humidity"] = weatherData.current.humidity;
    parsedDataCurrent["precip"] = weatherData.current.pop;
    parsedDataCurrent["iconName"] = weatherData.current.weather[0].icon;
    parsedDataCurrent["wind-speed"] = weatherData.current.wind_speed; // meter/sec
    
    createCurrentWeatherDiv(parsedDataCurrent, weatherData);
}

function createCurrentWeatherDiv(data, weatherData) {
    const summaryP = createSummaryP(data);
    const mainDataDiv = createMainDataDiv(data);
    const chartButtonsWrapperDiv = createChartButtonsWrapperDiv();
    const chartsContainer = createChartsContainer(weatherData);

    const currentWeatherWrapperDiv = document.querySelector(".current-weather");
    currentWeatherWrapperDiv.append(
        summaryP,
        mainDataDiv,
        chartsContainer,
        chartButtonsWrapperDiv,
    );
}
// createCurrentWeatherDiv() HELPER FUNCTIONS
function createSummaryP(data) {
    const day = daysOfTheWeek[data.dateObject.getDay()];
    const hours = data.dateObject.getHours();
    let minutes = data.dateObject.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    const description = data.description;
    
    const summaryP = document.createElement("p");
    summaryP.classList.add("summary");
    summaryP.textContent = `${day} ${hours}:${minutes}, ${description}`;
    
    return (summaryP);
}

function createMainDataDiv(data) {
    const bigIconImg = document.createElement("img");
    bigIconImg.setAttribute("src", `./images/weather-icons/${data.iconName}.png`);
    bigIconImg.setAttribute("alt", "icon of " + data.description);
    
    const temp = document.createElement("p");
    temp.classList.add("temp");
    temp.innerHTML = `${convertKelvinToCelsius(data.temperature)}<sup>°</sup>`

    const precip = document.createElement("li");
    precip.textContent = `Precip: ${data.precip | "0"}%`
    const humidity = document.createElement("li");
    humidity.textContent = `Humidity: ${data.humidity}%`;
    const windSpeed = document.createElement("li");
    windSpeed.textContent = `Wind: ${Math.round(data["wind-speed"] * 3.6)} km/h`;
    
    const list = document.createElement("ul");
    list.append(precip, humidity, windSpeed);
    
    const dataWrapperDiv = document.createElement("div");
    dataWrapperDiv.classList.add("data-wrapper");
    dataWrapperDiv.append(bigIconImg, temp, list);

    return (dataWrapperDiv);
}

function createChartButtonsWrapperDiv() {
    const temperatureChartButton = document.createElement("div");
    temperatureChartButton.textContent = "temperature";
    temperatureChartButton.classList.add("temperature-chart-button", "chart-button");
    temperatureChartButton.addEventListener("click", switchCharts);
    
    const precipitationChartButton = document.createElement("div");
    precipitationChartButton.textContent = "precipitation";
    precipitationChartButton.classList.add("precipitation-chart-button", "chart-button", "hidden");
    precipitationChartButton.addEventListener("click", switchCharts);
    
    const chartButtonsWrapperDiv = document.createElement("div");
    chartButtonsWrapperDiv.classList.add("chart-buttons-wrapper");
    chartButtonsWrapperDiv.append(temperatureChartButton, precipitationChartButton);

    return (chartButtonsWrapperDiv)
}
// createChartButtonsWrapperDiv() HELPER FUNCTIONS
function switchCharts(event) {
    const temperatureChart = document.querySelector(".temperature.chart");
    const precipitationChart = document.querySelector(".precipitation.chart");
    
    temperatureChart.classList.remove("hidden");
    precipitationChart.classList.remove("hidden");

    const temperatureChartButton = document.querySelector(".temperature-chart-button");
    const precipitationChartButton = document.querySelector(".precipitation-chart-button");
    
    temperatureChartButton.classList.remove("hidden");
    precipitationChartButton.classList.remove("hidden");

    if (event.target.classList[0].includes("temperature")) {
        precipitationChart.classList.add("hidden");
        precipitationChartButton.classList.add("hidden");
    } else {
        temperatureChart.classList.add("hidden");
        temperatureChartButton.classList.add("hidden");
    }
}
// END createChartButtonsWrapperDiv() HELPER FUNCTIONS

function createChartsContainer(weatherData) {
    const temperatureChart = createTemperatureChart(weatherData);
    const precipitationChart = createPrecipitationChart(weatherData);

    const chartsContainer = document.createElement("div");
    chartsContainer.classList.add("charts-container");
    chartsContainer.append(temperatureChart, precipitationChart);

    return (chartsContainer);
}
// createChartsContainer() HELPER FUNCTIONS
function createTemperatureChart(weatherData) {
    const temperatureData = [];
    const timestamps = [];
    
    for (let i = 0; i < 24; i++) {
        temperatureData.push(convertKelvinToCelsius(weatherData.hourly[i].temp));
    }
    for (let i = 0; i < 24; i++) {
        timestamps.push(new Date(weatherData.hourly[i].dt * 1000).getHours() + "h");
    }

    const newCanvas = document.createElement("canvas");
    newCanvas.classList.add("chart", "temperature");
    
    Chart.defaults.font.size = 16;
    Chart.defaults.color = "white";
    Chart.defaults.font.family = "Dosis";
    Chart.defaults.plugins.tooltip.enabled = false;

    const myChart = new Chart(newCanvas, {
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

    return (newCanvas);
}

function createPrecipitationChart(weatherData) {
    const precipitationData = [];
    const timestamps = [];
    
    for (let i = 0; i < 24; i++) {
        precipitationData.push(weatherData.hourly[i].pop * 100);
        // console.log(weatherData.hourly[i].pop);
    }
    for (let i = 0; i < 24; i++) {
        timestamps.push(new Date(weatherData.hourly[i].dt * 1000).getHours() + "h");
    }

    const newCanvas = document.createElement("canvas");
    newCanvas.classList.add("chart", "precipitation", "hidden");
    
    const ctx = newCanvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    const myChart = new Chart(newCanvas, {
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

    return (newCanvas);
}
// END createChartsContainer() HELPER FUNCTIONS

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
