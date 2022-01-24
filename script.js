const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", search);

const wrapperWeekDiv = document.querySelector(".wrapper-days");
console.log(wrapperWeekDiv);

window.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        search();
    }
});

const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

const APIkey = "be9f3e7fb99ef3d5a6cdca04ec93f7de";

function search() {
    const searchedLocation = searchBar.value;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchedLocation}&appid=${APIkey}`)
        .then(response => response.json())
        .then(weatherData => (processData(weatherData)))
};

const parsedData = [];

function processData(weatherData) {
    console.log(weatherData);
    for (listItem of weatherData.list) {
        const item = {};
        // console.log(listItem.weather[0].main);
        item["summary"] = listItem.weather[0].main;
        // console.log(listItem.weather[0].description);
        item["description"] = listItem.weather[0].description;
        // console.log(listItem.dt_txt.slice(11, 13));
        // item["time"] = listItem.dt_txt.slice(11, 13);
        item["date"] = new Date(listItem.dt * 1000);
        // console.log(listItem.main.temp)
        item["temperature"] = listItem.main.temp;
        // console.log(listItem.main.humidity)
        item["humidity"] = listItem.main.humidity;
        // console.log(listItem.clouds.all)
        item["clouds"] = listItem.clouds.all;
        // console.log(listItem.pop)
        item["precip"] = listItem.pop;
        // console.log(listItem.weather[0].icon);
        item["iconName"] = listItem.weather[0].icon;
        // if (listItem.pop > 0) {
        //     console.log(listItem);
        // }
        item["wind-speed"] = listItem.wind.speed; // meter/sec
        parsedData.push(item);
    }
    console.log(parsedData);
    console.log(parsedData[0]["date"].getHours());

    createDOMElements();
}

function createDOMElements() {
    let currentDay = "";
    for (const item of parsedData) {
        
        const dayOfCurrentItem = daysOfTheWeek[item.date.getDay()];
        // if item pertains to a new day, create new day wrapper and info wrapper divs
        if (currentDay !== dayOfCurrentItem) {
            currentDay = dayOfCurrentItem;
            
            // create new day wrapper and insert into week wrapper
            const newWrapperDayDiv = document.createElement("div");
            newWrapperDayDiv.classList.add("day");
            wrapperWeekDiv.append(newWrapperDayDiv);
            
            // create new header with day and insert into day wrapper
            const dayHeader = document.createElement("h2");
            dayHeader.textContent = dayOfCurrentItem;
            newWrapperDayDiv.append(dayHeader);
            
            // create new info wrapper (sub wrapper of day) and insert into day wrapper
            const newWrapperInfoDiv = document.createElement("div");
            newWrapperInfoDiv.classList.add("wrapper-info");
            // insert info wrapper into day wrapper
            newWrapperDayDiv.append(newWrapperInfoDiv);
        }

        const currentDayWrapper = wrapperWeekDiv.children[wrapperWeekDiv.children.length - 1];
        const currentInfoWrapper = currentDayWrapper.children[1];
        
        // create base data items for time section
        const newTimeP = createP("time", item.date.getHours() + "u");
        const newSummaryP = createP("summary", item.summary);
        const newTempP = createP("temperature", convertKelvinToCelsius(item.temperature) + "°");
        const newPrecipitationP = createP("precipitation", (item.precip * 100) + "%");
        const newHumidityP = createP("humidity", item.humidity + "%");
        const newWindSpeedP = createP("wind-speed", Math.round(item["wind-speed"] * 3.6));
        const newIconImg = document.createElement("img");
        newIconImg.classList.add("icon");
        newIconImg.setAttribute("src", `./images/${item.iconName}.png`);
        
        // create time section wrapper and insert base data items
        const newTimeSectionDiv = document.createElement("div");
        newTimeSectionDiv.classList.add("time-section");
        newTimeSectionDiv.append(newIconImg, newTimeP, newTempP, newPrecipitationP, newHumidityP, newWindSpeedP);
        
        // add time section to info wrapper
        currentInfoWrapper.append(newTimeSectionDiv);
    }
}

function createP(className, content) {
    const newP = document.createElement("p");
    newP.classList.add(className);
    newP.textContent = content;

    return (newP);
}

function convertKelvinToCelsius(F) {
    return (Math.round(F - 273.15));
}