const usersLine = document.querySelector(".calendar__lines-user");

function createDayItem(taskForDay) {
    let resultHTML;
    for (let day = 1; day < 8; day++) {
        let resultDayHTML = "";
        taskForDay[day-1].forEach((item)=>{
            resultDayHTML += `<div>${item.subject}</div>`;
        })
        resultHTML += `<div class="line-grid_day${day}">${resultDayHTML}</div>`;
    }
    return resultHTML;
}

function createUserLine(firstName, surname, lineUser) {
    return (`
        <div class="line-grid">
            <div class="line-grid_user">${firstName} ${surname}</div>
            ${lineUser}          
        </div>
    `)
}

//Проверено
function tasksForDay(queueWeek, taskForDay,dates) {
    queueWeek.forEach((item) => {
        let date = item.planStartDate.split("-");
        taskForDay[date[2]-dates[0].day].push(item);
    })
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
            tasksForDay(user.tasksForWeek,user.tasksForDay, dates);
            lineUser = createDayItem(user.tasksForDay);
        }
        usersLine.innerHTML += createUserLine(user.firstName, user.surname, lineUser);
    })
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

// export {updateUsersInTable};