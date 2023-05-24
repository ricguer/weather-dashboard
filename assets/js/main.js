                                                                /* ================= GLOBAL VARIABLES ================= */
const urlAPI     = "http://api.openweathermap.org/";            /* API URL                                              */
const urlIconSrc = "https://openweathermap.org/img/wn/"         /* Icon URL                                             */
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


                                                                /* ============ GENERATE DEFAULT DASHBOARD ============ */
$(function () 
{
    let currentWeather = fetchCurrentWeather("Miami");
    createCurrentWeatherCard(currentWeather);
    let fiveDayForecast = fetchFiveDayForecast("Miami");        /* Fetch full five day forecast of default city         */
    createFiveDayForecast(fiveDayForecast);                     /* Create five day forecast weather dashboard           */
});


                                                                /* ================= GLOBAL FUNCTIONS ================= */

function fetchCurrentWeather(cityName) 
{
    let processedCityName = cityName.replace(/\s+/g, "%20");    /* Replaces spaces with "%20" as per API example        */
    let requestURL = urlAPI + "data/2.5/weather?q=" + processedCityName + "&units=imperial" + "&appid=" + openWeatherKeyAPI;
    let currentWeather = fetch(requestURL)
                            .then((response) => response.json());

    return currentWeather;
}

/**
 * Fetches five day forecast from OpenWeather API
 * @param {*} cityName name of city used to retrieve forecast
 * @returns five day forecast API response
 */
function fetchFiveDayForecast(cityName) 
{
    let processedCityName = cityName.replace(/\s+/g, "%20");    /* Replaces spaces with "%20" as per API example        */

                                                                /* Concatinate request URL                              */
    let requestURL = urlAPI + "data/2.5/forecast?q=" + processedCityName + "&units=imperial" + "&appid=" + openWeatherKeyAPI;

                                                                /* Fetch five day forecast with defined request URL     */
    let fiveDayForecast =  fetch(requestURL)
                            .then((response) => response.json());

    return fiveDayForecast;
}


/**
 * Condenses the 40 element API response to just 5 - giving an overview of weather over 5 days.
 * @param {*} fullFiveDayForecast array of weather data for five days in three hour increments
 * @returns average weather per day for five days
 */
function averageFiveDayForecast(fullFiveDayForecast) 
{
    let averageFiveDay = [];

                                                                /* Create and save objects with weather info per day    */
    for (let forecastIndex = 0; forecastIndex < fullFiveDayForecast.list.length; forecastIndex += 8) 
    {
        const element = fullFiveDayForecast.list[forecastIndex];
        const iconSource = urlIconSrc + element.weather[0].icon + "@4x.png";

        averageFiveDay.push(new DayWeather( dayjs(element.dt_txt).format("MM/DD/YYYY"), 
                                            iconSource, 
                                            element.weather[0].description, 
                                            element.main.temp, 
                                            element.wind.speed, 
                                            element.main.humidity));
    }

    return averageFiveDay;
}


function createCurrentWeatherCard(currentWeather) 
{
    //TODO: Implement function to dynamically generate card for "Today's Weather"
}


/**
 * Dynamically clear and generate cards in "5-Day Forecast" section of dashboard.
 * 
 * @param {*} fiveDayForecast forecast used to generate day cards
 */
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


                                                                /* ================= EVENT LISTENERS ================== */

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
