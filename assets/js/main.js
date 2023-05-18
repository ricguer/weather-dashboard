$(function () 
{
    createFiveDayForecast();
});

function createFiveDayForecast() 
{
    let dayIndex = 1;

    let cardColDiv = $("<div>", {class: "col"});
    let card = $("<div>", {class: "card h-100"});
    let cardBody = $("<div>", {class: "card-body"});

    let cardTitle = $("<h5>", 
    {
        class: "card-title",
        text: dayjs().add(dayIndex, 'day').format('MM-DD-YYYY')
    });

    let cardImage = $("<img>", 
    {
        class: "card-img-top",
        src: "./assets/images/cloudy.svg",
        alt: "Insert alt text"
    });

    let cardListGroup = $("<ul>", 
    {
        class: "list-group list-group-flush",
    });

    let tempItem = $("<li>",
    {
        class: "list-group-item",
        text: "Temperature"
    });

    let windItem = $("<li>",
    {
        class: "list-group-item",
        text: "Wind"
    });

    let humidityItem = $("<li>",
    {
        class: "list-group-item",
        text: "Humidity"
    });

    cardListGroup.append(tempItem, windItem, humidityItem);
    cardBody.append(cardTitle, cardImage);
    card.append(cardBody, cardListGroup);
    cardColDiv.append(card);
    cardColDiv.appendTo("#card-row");
}
