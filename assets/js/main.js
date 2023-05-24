let apiURL = "http://api.openweathermap.org/";
let openWeatherKeyAPI = "2dac5e788766a237de5453bf4c85309a";

$(function () 
{
    // createFiveDayForecast();
});

function fetchFiveDayForecast(cityName) 
{
    let processedCityName = cityName.replace(/\s+/g, "%20");
    let requestURL = apiURL + "data/2.5/forecast?q=" + processedCityName + "&appid=" + openWeatherKeyAPI;
    let fiveDayForecast =  fetch(requestURL)
                            .then((response) => response.json())

    return fiveDayForecast;
}

function averageFiveDayForecast(fullFiveDayForecast) 
{
    let averageFiveDayObj;


}

function createFiveDayForecast(fiveDayForecast) 
{
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
                text: forecastFIveDays[dayIndex].date
            });
        
            let cardImage = $("<img>", 
            {
                class: "card-img-top",
                src: forecastFIveDays[dayIndex].icon,
                alt: forecastFIveDays[dayIndex].iconAltText
            });
        
            let cardListGroup = $("<ul>", 
            {
                class: "list-group list-group-flush",
            });
        
            let tempItem = $("<li>",
            {
                class: "list-group-item",
                text: forecastFIveDays[dayIndex].temperature
            });
        
            let windItem = $("<li>",
            {
                class: "list-group-item",
                text: forecastFIveDays[dayIndex].wind
            });
        
            let humidityItem = $("<li>",
            {
                class: "list-group-item",
                text: forecastFIveDays[dayIndex].humidity
            });
        
            cardListGroup.append(tempItem, windItem, humidityItem);
            cardBody.append(cardTitle, cardImage);
            card.append(cardBody, cardListGroup);
            cardColDiv.append(card);
            cardColDiv.appendTo("#card-row");
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
