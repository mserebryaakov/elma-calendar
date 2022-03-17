const backLog = document.querySelector(".backlog__tasks");

function createTaskInBacklog(name) {
    return(`
        <div class="backlog__tasks-item">
            <p>${name}</p>
        </div>
    `)
}

function updateBacklog(backlog) {
    backLog.innerHTML = ""
    backlog.forEach((item) => {
        backLog.innerHTML += createTaskInBacklog(item.subject);
    })
}

// export {updateBacklog};