class Storage {
    constructor() {
        this.users = [];
        this.backlog = [];
        this.dates = [];
        this.currentDate = new Date();
        this.now = new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),this.currentDate.getDate());
    }

    async init() {
        this.setDates();
        await this.setUsers();
        await this.setTasks();
    }

    setDates() {
        for ( let i=0; i < 7; i++) {
            this.dates.push({month: this.now.getMonth()+1,  day: this.now.getDate(), year: this.now.getFullYear()});
            this.now.setDate(this.now.getDate()+1);
        }
    }

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

    deleteBacklogItemById(taskId) {
        this.backlog = this.backlog.filter(item => item.id !== taskId);
    }

    addTaskForUser(taskId, userId, day = null) {
        this.users.forEach((user) => {
            if (user.id == userId) {
                this.backlog.forEach((task) => {
                    if (task.id === taskId) {
                        if (day !== null) {
                            this.changeDateOnTask(task, day);
                        }
                        user.tasks.push(task);
                    }
                })
            }
        })
    }

    changeDateOnTask(task, day) {
        task.planStartDate = `${this.dates[day-1].year}-${this.dates[day-1].month}-${this.dates[day-1].day}`;
    }

    checkWorkload(userId, day) {
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

    searchTaskDayById(taskId) {
        let day = null;
        this.backlog.forEach((task) => {
            if (task.id === taskId) {
                let date = task.planStartDate.split("-");
                day = date[2];
            }
        })
        return day;
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
})

//Посредники
function brokerRerender() {
    rerender(appStorage);
}

function brokerAddTaskForUser(taskId, userId, day = null) {
    appStorage.addTaskForUser(taskId, userId, day);
}

function brokerDeleteBacklogItemById(taskId) {
    appStorage.deleteBacklogItemById(taskId);
}

function brokerCheckWorkload(userId, day) {
    return appStorage.checkWorkload(userId, day);
}

function brokerSearchTaskDayById(taskId) {
    return appStorage.searchTaskDayById(taskId) - appStorage.dates[0].day + 1;
}