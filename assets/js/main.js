                                                                /* ================= GLOBAL VARIABLES ================= */
const apiURL = "http://api.openweathermap.org/";                /* API URL                                              */
const openWeatherKeyAPI = "2dac5e788766a237de5453bf4c85309a";   /* API Key                                              */
const rowOfCards = $("#card-row");

                                                                /* Object: stores weather data per card (day)           */
function DayWeather(date, 
                    icon, 
                    iconAltText, 
                    temperature, 
                    wind, 
                    humidity) 
{
    this.date         =  date;
    this.icon         =  icon;
    this.iconAltText  =  iconAltText;
    this.temperature  =  temperature;
    this.wind         =  wind;
    this.humidity     =  humidity;
}

$(function () 
{
    let fiveDayForecast = fetchFiveDayForecast("Miami");        /* Fetch full five day forecast of default city         */
    createFiveDayForecast(fiveDayForecast);                     /* Create five day forecast weather dashboard           */
});

function fetchFiveDayForecast(cityName) 
{
    let processedCityName = cityName.replace(/\s+/g, "%20");
    let requestURL = apiURL + "data/2.5/forecast?q=" + processedCityName + "&units=imperial" + "&appid=" + openWeatherKeyAPI;
    let fiveDayForecast =  fetch(requestURL)
                            .then((response) => response.json())

    console.log(fiveDayForecast);

    return fiveDayForecast;
}

function averageFiveDayForecast(fullFiveDayForecast) 
{
    let averageFiveDay = [];

    for (let forecastIndex = 0; forecastIndex < fullFiveDayForecast.list.length; forecastIndex += 8) {
        const element = fullFiveDayForecast.list[forecastIndex];
        
        averageFiveDay.push(new DayWeather( dayjs(element.dt_txt).format("MM/DD/YYYY"), 
                                            "./assets/images/sun.svg", 
                                            "Icon Alt Text", 
                                            element.main.temp, 
                                            element.wind.speed, 
                                            element.main.humidity));
    }

    return averageFiveDay;
}

function setWeatherIcon(weatherDescription) {
    
}



function createFiveDayForecast(fiveDayForecast) 
{
    rowOfCards.empty();

    fiveDayForecast.then((data) => {

        let forecastFiveDays = averageFiveDayForecast(data);

        for (let dayIndex = 0; dayIndex < forecastFiveDays.length; dayIndex++) 
        {
            let cardColDiv = $("<div>", {class: "col"});
            let card = $("<div>", {class: "card h-100", style: "max-width: 80%"});
            let cardBody = $("<div>", {class: "card-body"});
        
            let cardTitle = $("<h5>", 
            {
                class: "card-title",
                text: forecastFiveDays[dayIndex].date
            });
        
            let cardImage = $("<img>", 
            {
                class: "card-img-top",
                src: forecastFiveDays[dayIndex].icon,
                alt: forecastFiveDays[dayIndex].iconAltText
            });
        
            let cardListGroup = $("<ul>", 
            {
                class: "list-group list-group-flush",
            });
        
            let tempItem = $("<li>",
            {
                class: "list-group-item",
                text: "Temperature: " + forecastFiveDays[dayIndex].temperature + " °F"
            });
        
            let windItem = $("<li>",
            {
                class: "list-group-item",
                text: "Wind: " + forecastFiveDays[dayIndex].wind + " mph"
            });
        
            let humidityItem = $("<li>",
            {
                class: "list-group-item",
                text: "Humidity: " + forecastFiveDays[dayIndex].humidity + "%"
            });
        
            cardListGroup.append(tempItem, windItem, humidityItem);
            cardBody.append(cardTitle, cardImage);
            card.append(cardBody, cardListGroup);
            cardColDiv.append(card);
            cardColDiv.appendTo(rowOfCards);
        }
    });
}


/**
 * Event handler for city name submission.
 * 
 * @param {*} event 
 */
function cityNameSubmitEventListener(event) {
    event.preventDefault();                                     /* Prevent default form submit action (refreshing page) */

                                                                /* Replace spaces in city name with API syntax ("%20")  */
    let cityName = $('input[type="search"]').val().replace(/\s+/g, "%20");

    let fiveDayForecast = fetchFiveDayForecast(cityName);       /* Fetch full five day forecast of requested city       */
    createFiveDayForecast(fiveDayForecast);                     /* Create five day forecast weather dashboard           */
}


                                                                /* Apply event listener to city name "Submit" button    */
$("form").submit((event) => cityNameSubmitEventListener(event));
