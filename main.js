//import { getUsersAPI, getTasksAPI } from "./scripts/api/request.js";
// import { updateBacklog } from "./scripts/component/backlog.js";
// import { updateDateInTable } from "./scripts/component/date.js";
// import { updateUsersInTable } from "./scripts/component/calendar";

class Storage {
    constructor() {
        this.users = [];
        this.backlog = [];
        this.dates = [];
        this.currentDate = new Date();
        this.now = new Date(this.currentDate.getFullYear(),this.currentDate.getMonth(),this.currentDate.getDate());
    }

    setDates() {
        for ( let i=0; i < 7; i++) {
            this.dates.push({month: this.now.getMonth()+1,  day: this.now.getDate(), year: this.now.getFullYear()});
            this.now.setDate(this.now.getDate()+1);
        }
    }

    setUsers() {
        getUsers().then(result => {
            this.users = result.map(user => ({
                id: user.id,
                surname: user.surname,
                firstName: user.firstName,
                tasks: [],
                tasksForWeek: [],
                tasksForDay: [ [], [], [], [], [], [],[],]
            }))
        })
    }

    setTasks() {
        getTasks().then(result => {
            result.forEach(task => {
                if (task.executor !== null) {
                    this.users[task.executor-1].tasks.push(task);
                } else {
                    this.backlog.push(task);
                }
            })
        })
    }
}

function render(storage) {
    updateDateInTable(storage.dates);
    updateUsersInTable(storage.users, storage.dates);
    updateBacklog(storage.backlog);
}

let appStorage = new Storage();
appStorage.setDates();
appStorage.setUsers();
appStorage.setTasks();
render(appStorage);