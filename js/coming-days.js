import { daysOfTheWeek } from "./script.js";

export function createComingDaysSection(parsedData) {
    const dayTemplate = document.querySelector(".day");
    let lastHandledDay = "";
    let InfoWrapperDiv;

    for (const timeSection of parsedData) {
        const dayOfCurrentItem = daysOfTheWeek[timeSection.dateObject.getDay()];
        // if time section pertains to a new day, create new day div to put the time sections in
        if (lastHandledDay !== dayOfCurrentItem) {
            lastHandledDay = dayOfCurrentItem;
            
            const dayDiv = addDay(dayTemplate);
            dayDiv.children[0].textContent = dayOfCurrentItem;
            InfoWrapperDiv = dayDiv.children[1];
        }

        addTimeSectionToInfoWrapper(timeSection, InfoWrapperDiv);
    }
}
// createComingDaysSection() HELPER FUNCTIONS
function addDay(dayTemplate) {
    const newDay = dayTemplate.cloneNode(true);
    newDay.classList.remove("template");
    document.querySelector(".coming-days").append(newDay);

    return (newDay);
}

function addTimeSectionToInfoWrapper(item, InfoWrapperDiv) {
    // create base data items for time section
    const newTimeP = createP("time", item.dateObject.getHours() + "u");
    const newTempP = createP("temperature", Math.round(item.temperature) + "°");
    const newPrecipitationP = createP("precipitation", Math.round(item.precip * 100) + "%");
    const newHumidityP = createP("humidity", item.humidity + "%");
    const newWindSpeedP = createP("wind-speed", Math.round(item["wind-speed"] * 3.6));    
    const newIconImgWrapperDiv = createNewIconImgWrapperDiv(item);

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

function createNewIconImgWrapperDiv(item) {
    const newWeatherIconImg = document.createElement("img");
    newWeatherIconImg.classList.add("weather-icon");
    newWeatherIconImg.setAttribute("src", `./images/weather-icons/${item.iconName}.png`);
    newWeatherIconImg.setAttribute("alt", "icon of " + item.description);

    const newIconImgWrapperDiv = document.createElement("div");
    newIconImgWrapperDiv.classList.add("weather-icon-wrapper");
    newIconImgWrapperDiv.append(newWeatherIconImg);
    addTooltip(newIconImgWrapperDiv, item.description);

    return (newIconImgWrapperDiv);
}

function addTooltip(parentElem, tooltipContent) {
    const newTooltip = document.createElement("div");
    newTooltip.classList.add("tooltip");
    newTooltip.textContent = tooltipContent;
    
    parentElem.append(newTooltip);
}

// END addTimeSectionToInfoWrapper() HELPER FUNCTIONS

// END createComingDaysSection() HELPER FUNCTIONS
