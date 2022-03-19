const datesLine = document.querySelector(".calendar__lines-dates");
const buttonNextWeek = document.querySelector(".calendar__button_right");
const buttonPreviousWeek = document.querySelector(".calendar__button_left");

buttonNextWeek.onclick = () => {
    brokerOnClickNextWeek();
}

buttonPreviousWeek.onclick = () => {
    brokerOnClickPreviousWeek();
}

//Создание html разметки панели дат
function createDateLine(dates) {
    return (`
        <div class="line-grid_user">Имя</div>
        <div class="line-grid_day1">${dates[0].day}.${dates[0].month}</div>
        <div class="line-grid_day2">${dates[1].day}.${dates[1].month}</div>
        <div class="line-grid_day3">${dates[2].day}.${dates[2].month}</div>
        <div class="line-grid_day4">${dates[3].day}.${dates[3].month}</div>
        <div class="line-grid_day5">${dates[4].day}.${dates[4].month}</div>
        <div class="line-grid_day6">${dates[5].day}.${dates[5].month}</div>
        <div class="line-grid_day7">${dates[6].day}.${dates[6].month}</div>
    `);
}

//Обновление панели дат
function updateDateInTable(dates) {
    datesLine.innerHTML = "";
    datesLine.innerHTML += createDateLine(dates);
}