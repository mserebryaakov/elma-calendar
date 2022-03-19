const usersLine = document.querySelector(".calendar__lines-user");
let calendarZoneUser = null;
let calendarZoneDay = null;

//Draggable
function allowDrop(event) {
    event.preventDefault();
}

//Drop задачи на пользователя
function dropInUser(event) {
    let taskId = event.dataTransfer.getData("id");
    let date = brokerSearchTaskDayById(taskId);
    let userId = event.target.id;
    if (brokerCheckWorkloadInDate(userId, date) < 3) {
        brokerAddTaskForUser(taskId, userId);
        brokerDeleteBacklogItemById(taskId);
        brokerRerender();
    }
}

//Drop задачи на день
function dropInDay(event) {
    let taskId = event.dataTransfer.getData("id");
    let sectionDay = event.target.id;
    let [userId, day] = sectionDay.split("-");
    if (brokerCheckWorkloadOnDayThisWeek(userId, day)) {
        brokerAddTaskForUser(taskId, userId, day);
        brokerDeleteBacklogItemById(taskId);
        brokerRerender();
    }
}

//Прикрепление ondragstart к draggable элементам (пользователям и дням) в зоне календаря
function updateDraggableCalendarZone() {
    calendarZoneUser = document.querySelectorAll(".calendar__zone-user");
    calendarZoneUser.forEach((item) => {
        item.ondragover = allowDrop;
        item.ondrop = dropInUser;
    })

    calendarZoneDay = document.querySelectorAll(".calendar__zone-day");
    calendarZoneDay.forEach((item) => {
        item.ondragover = allowDrop;
        item.ondrop = dropInDay;
    })
}

//Создание html разметки для дня в календаре
function createDayItem(taskForDay,userId) {
    let resultHTML = "";
    for (let day = 1; day < 8; day++) {
        let overloadedDay = "";
        let countTasks = 0;
        let resultDayHTML = "";
        taskForDay[day-1].forEach((item)=>{
            countTasks += 1;
            resultDayHTML += `<div 
                class="user-task-for-day"
                data-title="
                creationDate: ${item.creationDate}; 
                planEndDate: ${item.planEndDate}">
            ${item.subject}
            </div>`;
        })
        if (countTasks > 0) overloadedDay = "not-overloaded-day";
        if (countTasks === 3) overloadedDay = "overloaded-day";
        resultHTML += `<div class="line-grid_day${day} calendar__zone-day ${overloadedDay}" id="${userId}-${day}">${resultDayHTML}</div>`;
    }
    return resultHTML;
}

//Создание html разметки для пользователя на неделю
function createUserLine(firstName, surname, lineUser,userId) {
    return (`
        <div class="line-grid line-grid_users">
            <div class="line-grid_user calendar__zone-user" id="${userId}">${firstName} ${surname}</div>
            ${lineUser}          
        </div>
    `)
}

//Генерация задач на каждый день в неделе
function tasksForDay(queueWeek,dates) {
    let tasksForDay = [ [], [], [], [], [], [],[]]
    queueWeek.forEach((item) => {
        let date = item.planStartDate.split("-");
        dates.forEach((dateItem, index) => {
            if (date[2] == dateItem.day) {
                tasksForDay[index].push(item);
            }
        })
    })
    return tasksForDay;
}


//Генерация задач на неделю
function tasksForWeek(queue, dates) {
    let start = new Date(dates[0].year, dates[0].month, dates[0].day)
    let stop = new Date(dates[6].year, dates[6].month, dates[6].day)
    return queue.filter((item) => {
        let date = item.planStartDate.split("-");
        let taskDate = new Date(date[0],date[1],date[2]);
        return inRange(taskDate,start,stop);
    })
}


//Обновление календаря
function updateUsersInTable(users, dates) {
    usersLine.innerHTML = ""
    users.forEach((user)=>{
        let lineUser = "";
        if (user.tasks.length !== 0) {
            user.tasksForWeek = tasksForWeek(user.tasks, dates);
            user.tasksForDay = tasksForDay(user.tasksForWeek, dates);
        }
        lineUser = createDayItem(user.tasksForDay, user.id);
        usersLine.innerHTML += createUserLine(user.firstName, user.surname, lineUser, user.id);
    })
    updateDraggableCalendarZone();
}

//Сравнение даты
function convert(d) {
    return (
        d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0],d[1],d[2]) :
        d.constructor === Number ? new Date(d) :
        d.constructor === String ? new Date(d) :
        typeof d === "object" ? new Date(d.year,d.month,d.date) :
        NaN
    );
}

function inRange(d,start,end) {
   return (
        isFinite(d=convert(d).valueOf()) &&
        isFinite(start=convert(start).valueOf()) &&
        isFinite(end=convert(end).valueOf()) ?
        start <= d && d <= end :
        NaN
    );
}