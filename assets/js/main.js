                                                                /* ================= GLOBAL VARIABLES ================= */
const urlAPI     = "http://api.openweathermap.org/";            /* API URL                                              */
const urlIconSrc = "https://openweathermap.org/img/wn/"         /* Icon URL                                             */
const curWeatherContain = $("#todays-weather-card-container");  /* Container for city's current weather conditions      */
const rowOfCards = $("#card-row");                              /* Row of cards for 5 Day Weather Forecast              */

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
    let defaultCity = "Miami";                                  /* Set default name of city when page first loads       */
    $("#city-name").text(defaultCity);                          /* Update city name on dashboard                        */
    let currentWeather = fetchCurrentWeather(defaultCity);      /* Fetch current weather of selected city               */
    updateCurrentWeatherCard(currentWeather);                   /* Update card containing current weather for city      */
    let fiveDayForecast = fetchFiveDayForecast(defaultCity);    /* Fetch full five day forecast of default city         */
    createFiveDayForecast(fiveDayForecast);                     /* Create five day forecast weather dashboard           */
    createRecentlySearchedList();                               /* Generate list of recently searched cities            */
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

        //TODO: Thoroughly comb through response to get an accurate 5 day forecast.

                                                                /* Save chosen day to the array that will be returned   */
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

                                                                /* Set current date's weather icon alt text             */
        $("#current-icon").attr("alt", data.weather[0].description);
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
            let cardColDiv  =  $("<div>", {class: "col"});
            let card        =  $("<div>", {class: "card h-100"});
            let cardBody    =  $("<div>", {class: "card-body"});
        
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


/**
 * Generate and display a list of recently searched cities.
 */
function createRecentlySearchedList() 
{
    $("#recently-searched-list").empty();

    for (let i = 0; i < localStorage.length; i++) 
    {
        let key    =  localStorage.key(i);
        let value  =  localStorage.getItem(key);

                                                                /* Create new list item for city name                   */
        let newSearchItem = $("<li>", 
        {
            class: "nav-item",
        });

                                                                /* Create a link to the respective city                 */
        let itemContent = $("<a>",
        {
            href: "#",
            class: "nav-link link-dark",
            text: value,
            onclick: "updateWeatherDashEventListener(this)"
        })

        newSearchItem.append(itemContent);                      /* Add content to item before appending to list         */
        $("#recently-searched-list").append(newSearchItem);     /* Add searched city name to recently searched list     */
    }
}


/**
 * Updates local storage and recently searched list for 
 * newly searched city names.
 * 
 * @param {*} cityName name of city to add to recently 
 * searched list
 * @returns 
 */
function updateRecentlySearched(cityName)
{
                                                                /* Return if city name has already been searched        */
    if (localStorage.getItem(cityName) === null)
    {
        localStorage.setItem(cityName, cityName);               /* Save city name to local storage                      */
    
                                                                /* Create new list item for city name                   */
        let newSearchItem = $("<li>", 
        {
            class: "nav-item",
        });

        let itemContent = $("<a>",
        {
            href: "#",
            class: "nav-link link-dark",
            text: cityName
        })
    
        newSearchItem.append(itemContent);
        $("#recently-searched-list").append(newSearchItem);     /* Add searched city name to recently searched list     */
    };
}


                                                                /* ================= EVENT LISTENERS ================== */

/**
 * Event handler for city name submission.
 * 
 * @param {*} event 
 */
function cityNameSubmitEventListener(event) 
{
    event.preventDefault();                                     /* Prevent default form submit action (refreshing page) */

    try 
    {
        let cityNameUserInput = $('input[type="search"]').val();

                                                                /* Replace spaces in city name with API syntax ("%20")  */
        let formattedCityName = cityNameUserInput.replace(/\s+/g, "%20");
    
                                                                /* Fetch city's current weather                         */
        let currentWeather = fetchCurrentWeather(formattedCityName);  

                                                                /* Fetch full five day forecast of requested city       */
        let fiveDayForecast = fetchFiveDayForecast(formattedCityName);
        
        $("#city-name").text(cityNameUserInput);
        updateCurrentWeatherCard(currentWeather);               /* Update card containing city's current weather        */
        createFiveDayForecast(fiveDayForecast);                 /* Create five day forecast weather dashboard           */
        updateRecentlySearched(cityNameUserInput);              /* Add city name to user's city search history          */
    } 
    catch (error) 
    {
        //TODO: Create and handle an error for cities that are not found
    }
}

                                                                /* Apply event listener to city name "Submit" button    */
$("form").submit((event) => cityNameSubmitEventListener(event));


/**
 * Event listener for links of recently searched list.
 * 
 * @param {*} element link element from the recently 
 * searched list
 */
function updateWeatherDashEventListener(element) 
{
    let newCity = element.textContent;                          /* Set new city name                                    */

    $("#city-name").text(newCity);                              /* Update city name on dashboard                        */
    let currentWeather = fetchCurrentWeather(newCity);          /* Fetch current weather of selected city               */
    updateCurrentWeatherCard(currentWeather);                   /* Update card containing current weather for city      */
    let fiveDayForecast = fetchFiveDayForecast(newCity);        /* Fetch full five day forecast of default city         */
    createFiveDayForecast(fiveDayForecast);                     /* Create five day forecast weather dashboard           */
    createRecentlySearchedList();                               /* Generate list of recently searched cities            */
}
