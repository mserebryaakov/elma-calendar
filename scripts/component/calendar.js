const usersLine = document.querySelector(".calendar__lines-user");
let calendarZoneUser = null;
let calendarZoneDay = null;

//Draggable
function allowDrop(event) {
    event.preventDefault();
}

function dropInUser(event) {
    let taskId = event.dataTransfer.getData("id");
    let day = brokerSearchTaskDayById(taskId);
    console.log(day);
    let userId = event.target.id;
    if (brokerCheckWorkload(userId, day)) {
        brokerAddTaskForUser(taskId, userId);
        brokerDeleteBacklogItemById(taskId);
        console.log(taskId);
        console.log(userId);
        brokerRerender();
    }
}

function dropInDay(event) {
    let taskId = event.dataTransfer.getData("id");
    let sectionDay = event.target.id;
    console.log(sectionDay);
    let [userId, day] = sectionDay.split("-");
    if (brokerCheckWorkload(userId, day)) {
        brokerAddTaskForUser(taskId, userId, day);
        brokerDeleteBacklogItemById(taskId);
        console.log(userId + "-" + day);
        brokerRerender();
    }
}

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

function createDayItem(taskForDay,userId) {
    let resultHTML = "";
    for (let day = 1; day < 8; day++) {
        let resultDayHTML = "";
        taskForDay[day-1].forEach((item)=>{
            resultDayHTML += `<div>${item.subject}</div>`;
        })
        resultHTML += `<div class="line-grid_day${day} calendar__zone-day" id="${userId}-${day}">${resultDayHTML}</div>`;
    }
    return resultHTML;
}

function createUserLine(firstName, surname, lineUser,userId) {
    return (`
        <div class="line-grid line-grid_users">
            <div class="line-grid_user calendar__zone-user" id="${userId}">${firstName} ${surname}</div>
            ${lineUser}          
        </div>
    `)
}

//Проверено
function tasksForDay(queueWeek,dates) {
    let tasksForDay = [ [], [], [], [], [], [],[]]
    queueWeek.forEach((item) => {
        let date = item.planStartDate.split("-");
        tasksForDay[date[2]-dates[0].day].push(item);
    })
    return tasksForDay;
}


//Проверено
function tasksForWeek(queue, dates) {
    return queue.filter((item) => {
        let date = item.planStartDate.split("-");
        let taskDate = new Date(date[0],date[1],date[2]);
        let start = new Date(dates[0].year, dates[0].month, dates[0].day)
        let stop = new Date(dates[6].year, dates[6].month, dates[6].day)
        return inRange(taskDate,start,stop);
    })
}


//Проверено
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