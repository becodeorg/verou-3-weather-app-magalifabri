// IMPORTS

import { daysOfTheWeek } from "./script.js";

// GLOBAL VARIABLES

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


// FUNCTIONS

export function createCurrentWeatherDiv(currentWeatherData, allWeatherData) {
    fillSummaryP(currentWeatherData);
    fillMainDataDiv(currentWeatherData);
    drawTemperatureChart(allWeatherData);
    drawPrecipitationChart(allWeatherData);

    currentWeatherDOMElems.temperatureChartButton.addEventListener("click", switchCharts);
    currentWeatherDOMElems.precipitationChartButton.addEventListener("click", switchCharts);
}

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
    
    currentWeatherDOMElems.bigTemperatureNumber.innerHTML = `${Math.round(data.temperature)}<sup>°</sup>`

    currentWeatherDOMElems.precipitationLi.textContent = `Precip: ${data.precip | "0"}%`;
    currentWeatherDOMElems.humidityLi.textContent = `Humidity: ${data.humidity}%`;
    currentWeatherDOMElems.windLi.textContent = `Wind: ${Math.round(data["wind-speed"] * 3.6)} km/h`;
}

function drawTemperatureChart(weatherData) {
    const temperatureData = [];
    const timestamps = [];
    
    for (let i = 0; i < 24; i++) {
        temperatureData.push(Math.round(weatherData.hourly[i].temp));
    }
    for (let i = 0; i < 24; i++) {
        timestamps.push(new Date(weatherData.hourly[i].dt * 1000).getHours() + "h");
    }

    Chart.defaults.font.size = 16;
    Chart.defaults.color = "white";
    Chart.defaults.font.family = "Dosis";
    Chart.defaults.plugins.tooltip.enabled = false;

    if (currentWeatherDOMElems.temperatureChart.chartInstance) {
        currentWeatherDOMElems.temperatureChart.chartInstance.destroy();
    }

    currentWeatherDOMElems.temperatureChart.chartInstance = new Chart(currentWeatherDOMElems.temperatureChart, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                data: temperatureData,
                pointRadius: 0, // hide dots on line
                borderColor: "white",
                borderWidth: 2,
                fill: true,
                backgroundColor: "transparent",
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
                        size: 20,
                        callback: function(value, index, ticks) {
                            return value + "°C";
                        }, // add "°C" to tick labels
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
    }
    for (let i = 0; i < 24; i++) {
        timestamps.push(new Date(weatherData.hourly[i].dt * 1000).getHours() + "h");
    }

    if (currentWeatherDOMElems.precipitationChart.chartInstance) {
        currentWeatherDOMElems.precipitationChart.chartInstance.destroy();
    }

    const ctx = currentWeatherDOMElems.precipitationChart.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');   
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    currentWeatherDOMElems.precipitationChart.chartInstance = new Chart(currentWeatherDOMElems.precipitationChart, {
        type: 'bar',
        data: {
            labels: timestamps,
            datasets: [{
                barThickness: 10,
                data: precipitationData,
                pointRadius: 0, // hide dots on line
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
