                                                                /* ================= GLOBAL VARIABLES ================= */
const urlAPI     = "http://api.openweathermap.org/";            /* API URL                                              */
const urlIconSrc = "https://openweathermap.org/img/wn/"         /* Icon URL                                             */
const curWeatherContain = $("#todays-weather-card-container");
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
    let defaultCity = "Miami";
    let currentWeather = fetchCurrentWeather(defaultCity);
    updateCurrentWeatherCard(currentWeather);
    let fiveDayForecast = fetchFiveDayForecast(defaultCity);    /* Fetch full five day forecast of default city         */
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
 * @param {*} cityName name of city used to retrieve 
 * forecast
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
 * Condenses the 40 element API response to just 5 - giving 
 * an overview of weather over 5 days.
 * @param {*} fullFiveDayForecast array of weather data for
 * five days in three hour increments
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


function updateCurrentWeatherCard(currentWeather) 
{
                                                                /* Wait for current weather data availability           */
    currentWeather.then((data) => {

                                                                /* Concatinate icon source URL                          */
        const iconSource = urlIconSrc + data.weather[0].icon + "@4x.png";

        $("#current-date").text(dayjs().format("MM/DD/YYYY"));  /* Format and set current date                          */
        $("#current-temp").text(data.main.temp + " °F");        /* Set current date's temperature                       */
        $("#current-wind").text(data.wind.speed + " mph");      /* Set current date's wind speed                        */
        $("#current-humidity").text(data.main.humidity + "%");  /* Set current date's humidity                          */
        $("#current-icon").attr("src", iconSource);             /* Set current date's weather icon                      */
    });
}


/**
 * Dynamically clear and generate cards in "5-Day Forecast"
 * section of dashboard.
 * 
 * @param {*} fiveDayForecast forecast used to generate day
 * cards
 */
function createFiveDayForecast(fiveDayForecast)
{
    rowOfCards.empty();                                         /* Clear current 5 day forecast                         */

                                                                /* Wait for five day forecast data                      */
    fiveDayForecast.then((data) => {

        let forecastFiveDays = averageFiveDayForecast(data);    /* Extract five data points from full forecast array    */

        for (let dayIndex = 0; dayIndex < forecastFiveDays.length; dayIndex++) 
        {
            let cardColDiv = $("<div>", {class: "col"});
            let card = $("<div>", {class: "card h-100"});
            let cardBody = $("<div>", {class: "card-body"});
        
                                                                /* -------------------- Card Title -------------------- */
            let cardTitle = $("<h5>", 
            {
                class: "card-title",
                text: forecastFiveDays[dayIndex].date
            });
        
                                                                /* -------------------- Card Image -------------------- */
            let cardImage = $("<img>", 
            {
                class: "card-img-top",
                src: forecastFiveDays[dayIndex].icon,
                alt: forecastFiveDays[dayIndex].iconAltText
            });
        
                                                                /* -------------------- Card Data --------------------- */
            let cardListGroup = $("<ul>", 
            {
                class: "list-group list-group-flush",
            });
        
                                                                /* -------------- Card Data: Temperature -------------- */
            let tempItem = $("<li>",
            {
                class: "list-group-item",
                text: "Temperature: " + forecastFiveDays[dayIndex].temperature + " °F"
            });
        
                                                                /* ----------------- Card Data: Wind ------------------ */
            let windItem = $("<li>",
            {
                class: "list-group-item",
                text: "Wind: " + forecastFiveDays[dayIndex].wind + " mph"
            });
        
                                                                /* --------------- Card Data: Humidity ---------------- */
            let humidityItem = $("<li>",
            {
                class: "list-group-item",
                text: "Humidity: " + forecastFiveDays[dayIndex].humidity + "%"
            });
        
                                                                /* -------- Append Cards to Respective Section -------- */
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

    let currentWeather = fetchCurrentWeather(cityName);         /* Fetch city's current weather                         */
    updateCurrentWeatherCard(currentWeather);                   /* Update card containing city's current weather        */

    let fiveDayForecast = fetchFiveDayForecast(cityName);       /* Fetch full five day forecast of requested city       */
    createFiveDayForecast(fiveDayForecast);                     /* Create five day forecast weather dashboard           */
}

                                                                /* Apply event listener to city name "Submit" button    */
$("form").submit((event) => cityNameSubmitEventListener(event));
