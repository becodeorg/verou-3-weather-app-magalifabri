const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", search);

window.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        search();
    }
});

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
        // if (listItem.pop > 0) {
        //     console.log(listItem);
        // }
        parsedData.push(item);
    }
    console.log(parsedData);
    console.log(parsedData[0]["date"].getHours());
}

// function createDOMElements() {
//     for (const item of parsedData) {

//     }
// }
