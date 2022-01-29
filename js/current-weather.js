// IMPORTS

import { daysOfTheWeek } from "./script.js";

// GLOBAL VARIABLES

const currentWeatherDOMElems = {
    summaryP: document.querySelector(".summary"),
    
    bigWeatherIcon: document.querySelector(".big-weather-icon"),
    bigTemperatureNumber: document.querySelector(".big-temperature-number"),
    
    precipitationLi: document.querySelector(".data-list .precipitation .number"),
    humidityLi: document.querySelector(".data-list .humidity .number"),
    windLi: document.querySelector(".data-list .wind .number"),
    
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

    currentWeatherDOMElems.precipitationLi.textContent = data.precip | "0";
    currentWeatherDOMElems.humidityLi.textContent = data.humidity;
    currentWeatherDOMElems.windLi.textContent = Math.round(data["wind-speed"] * 3.6);
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
        plugins: [ChartDataLabels],
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
                
                datalabels: {
                    align: "top",
                    padding: {
                        left: 20,
                        bottom: 10,
                        right: 20,
                    },
                    display: "auto",
                    formatter: value => value + "°",
                }
            }]
        },
        options: {
            hover: {
                mode: null,
            },
            layout: {
                padding: {
                    top: 20,
                    left: 10,
                    right: 10,
                },
            },
            scales: {
                y: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    beginAtZero: true,
                    ticks: {
                        display: false,
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

    currentWeatherDOMElems.precipitationChart.chartInstance = new Chart(currentWeatherDOMElems.precipitationChart, {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: timestamps,
            datasets: [{
                barThickness: 10,
                data: precipitationData,
                pointRadius: 0, // hide dots on line
                fill: true,
                backgroundColor: "rgba(255, 255, 255, .3)", // use created gradient
                tension: 0.3, // make line more curvy
                
                datalabels: {
                    anchor: "end",
                    align: "top",
                    padding: {
                        left: 5,
                        right: 5,
                    },
                    display: "auto",
                    formatter: value => value > 0 ? value + "%" : "",
                }
            }]
        },
        options: {
            hover: {
                mode: null,
            },
            layout: {
                padding: {
                    top: 20,
                    left: 10,
                    right: 10,
                },
            },
            scales: {
                y: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    beginAtZero: true,
                    ticks: {
                        display: false,
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
