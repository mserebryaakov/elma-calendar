const backLog = document.querySelector(".backlog__tasks");
let draggableTask = null;

function drag(event) {
    event.dataTransfer.setData("id", event.target.id);
}

function updateDraggableBacklogZone() {
    draggableTask = document.querySelectorAll(".draggable_task");
    draggableTask.forEach((item) => {
        item.ondragstart = drag;
    })
}

function createTaskInBacklog(name, id) {
    return(`
        <div class="backlog__tasks-item draggable_task" id="${id}" draggable="true">
            <p>${name}</p>
        </div>
    `)
}

function updateBacklog(backlog) {
    backLog.innerHTML = ""
    backlog.forEach((item) => {
        backLog.innerHTML += createTaskInBacklog(item.subject, item.id);
    })
    updateDraggableBacklogZone();
}