const backLog = document.querySelector(".backlog__tasks");
const backlogInput = document.querySelector("#backlog-input");

function searcher() {
    let value = this.value.toLowerCase();
    let elasticItems = document.querySelectorAll(".backlog__tasks-item p");
    if (value !== "") {
        elasticItems.forEach((item) => {
            if (item.innerText.toLowerCase().search(value) === -1) {
                item.classList.add("backlog__hide");
                item.parentNode.classList.add("backlog__hide");
            }
            else {
                item.classList.remove("backlog__hide");
                item.parentNode.classList.remove("backlog__hide");
            }
        })
    } else {
        elasticItems.forEach((item) => {
            item.classList.remove("backlog__hide");
            item.parentNode.classList.remove("backlog__hide");
        })
    }
}

backlogInput.oninput = searcher;

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
            <p id="backlog-items-text">${name}</p>
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