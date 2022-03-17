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

    deleteBacklogItemById(id) {
        this.backlog = this.backlog.filter(item => item.id !== id)
    }

    addTaskForUser(task) {
        //логика
    }
}

function render(storage) {
    updateDateInTable(storage.dates);
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
