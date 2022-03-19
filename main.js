class Storage {
    constructor() {
        this.users = [];
        this.backlog = [];
        this.dates = [];
        this.currentDate = new Date();
        this.now = new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),this.currentDate.getDate());
    }

    //Инициализация данных
    async init() {
        this.setDates();
        await this.setUsers();
        await this.setTasks();
    }

    //Инициализация дат
    setDates() {
        this.dates = [];
        for ( let i=0; i < 7; i++) {
            this.dates.push({month: this.now.getMonth()+1,  day: this.now.getDate(), year: this.now.getFullYear()});
            this.now.setDate(this.now.getDate()+1);
        }
    }

    //Инициализация пользователей
    async setUsers() {
        await getUsers().then(result => {
            this.users = result.map(user => ({
                id: user.id,
                surname: user.surname,
                firstName: user.firstName,
                tasks: [],
                tasksForWeek: [],
                tasksForDay: [ [], [], [], [], [], [],[]]
            }))
        })
    }

    //Инициализация задач
    async setTasks() {
        await getTasks().then(result => {
            result.forEach(task => {
                if (task.executor !== null) {
                    this.users[task.executor-1].tasks.push(task);
                } else {
                    this.backlog.push(task);
                }
            })
        })
    }

    //Удаление задачи из backlog по id
    deleteBacklogItemById(taskId) {
        this.backlog = this.backlog.filter(item => item.id !== taskId);
    }

    //Добавление задачи для пользователя
    addTaskForUser(taskId, userId, day = null) {
        this.users.forEach((user) => {
            if (user.id == userId) {
                this.backlog.forEach((task) => {
                    if (task.id === taskId) {
                        if (day !== null) {
                            this.changeDateAndExecutorOnTask(task, day, userId);
                        }
                        user.tasks.push(task);
                    }
                })
            }
        })
    }

    //Изменения даты старта задачи и исполнителя
    changeDateAndExecutorOnTask(task, day, userId) {
        let monthWithZero = this.dates[day-1].month < 10? "0" + String(this.dates[day-1].month) : this.dates[day-1].month;
        let dayWithZero = this.dates[day-1].day < 10? "0" + String(this.dates[day-1].day) : this.dates[day-1].day;
        task.planStartDate = `${this.dates[day-1].year}-${monthWithZero}-${dayWithZero}`;
        task.executor = `${userId}`;
    }

    //Проверка занятости пользователя на определенную дату
    checkWorkloadInDate(userId, date, day = null) {
        let countTask = 0;
        this.users.forEach((user) => {
            if (user.id == userId) {
                user.tasks.forEach((task) => {
                    if (date == task.planStartDate) {
                        countTask += 1;
                    }
                })
            }
        })
        return countTask;
    }

    //Проверка занятости пользователя на определенный день в текущей неделе
    checkWorkloadOnDayThisWeek(userId, day) {
        let flag = false;
        this.users.forEach((user) => {
            if (user.id == userId) {
                if (user.tasksForDay[day-1].length < 3) {
                    flag = true;
                } 
            }
        })
        return flag;
    }

    //Поиск задачи по id
    searchTaskDayById(taskId) {
        let date = null;
        this.backlog.forEach((task) => {
            if (task.id === taskId) {
                date = task.planStartDate;
            }
        })
        return date;
    }

    //Перерасчет дат на следующую неделю
    nextWeek() {
        this.setDates();
    }

    //Перерасчет дат на предыдущую неделю
    previousWeek() {
        this.now.setDate(this.now.getDate()-14);
        this.setDates();
    }
}

function render(storage) {
    updateDateInTable(storage.dates);
    updateUsersInTable(storage.users, storage.dates);
    updateBacklog(storage.backlog);
}

function rerender(storage) {
    updateUsersInTable(storage.users, storage.dates);
    updateBacklog(storage.backlog);
}

let appStorage = new Storage();

let beforeRender = async (appStorage) => {
    await appStorage.init();
}

beforeRender(appStorage).then(() => {
    render(appStorage);
    endGetDate();
})

//Посредники
function brokerOnClickNextWeek() {
    appStorage.nextWeek();
    render(appStorage);
}

function brokerOnClickPreviousWeek() {
    appStorage.previousWeek();
    render(appStorage);
}

function brokerRerender() {
    rerender(appStorage);
}

function brokerAddTaskForUser(taskId, userId, day = null) {
    appStorage.addTaskForUser(taskId, userId, day);
}

function brokerDeleteBacklogItemById(taskId) {
    appStorage.deleteBacklogItemById(taskId);
}

function brokerCheckWorkloadInDate(userId, date) {
    return appStorage.checkWorkloadInDate(userId, date);
}

function brokerCheckWorkloadOnDayThisWeek(userId, day) {
    return appStorage.checkWorkloadOnDayThisWeek(userId, day);
}

function brokerSearchTaskDayById(taskId) {
    return appStorage.searchTaskDayById(taskId);
}