document.addEventListener('DOMContentLoaded', () => {
    let inputBox = document.querySelector('input')
    let addTaskBtn = document.querySelector('.add-task')
    let taskList = document.querySelector('ul')
    let filterTasks = document.querySelector('.filter')

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    let activeTasks = tasks.filter(task => task.isCompleted === false)
    let completedTasks = tasks.filter(task => task.isCompleted === true)



    tasks.forEach(task => showTasks(task));

    filterTasks.addEventListener('click', (event) => {
        if(event.target.classList.contains('all')){
            taskList.replaceChildren()
            tasks.forEach(task => showTasks(task))

        }else if(event.target.classList.contains('active')){
            taskList.replaceChildren()
            activeTasks.forEach(task => showTasks(task))

        }else if(event.target.classList.contains('completed')){
            taskList.replaceChildren()
            completedTasks.forEach(task => showTasks(task))
        }
    })




    addTaskBtn.addEventListener('click', (event) => addTask(event))

    function addTask(event){
        event.preventDefault()
        let taskText = inputBox.value.trim()

        if(taskText === "") return

        let newTask = {
            id: Date.now(),
            text: taskText,
            isCompleted: false
        }

        tasks.push(newTask)
        saveTask()
        showTasks(newTask)

        inputBox.value = ''
    }

    function showTasks(task){
        const li = document.createElement('li')
        const checkDiv = document.createElement('div')
        const textDiv = document.createElement('div')
        const delBtn = document.createElement('button')

        if(task.isCompleted){
            li.classList.add('task-completed')
        }

        li.dataset.taskId = task.id

        checkDiv.classList.add('check-btn')
        checkDiv.innerHTML = '<img class="check" src="./images/icon-check.svg" alt="">'

        textDiv.classList.add('task-text')
        textDiv.textContent = task.text

        delBtn.classList.add('del-btn')
        delBtn.innerHTML = '<img class="del" src="./images/icon-cross.svg" alt="">'

        li.append(checkDiv, textDiv, delBtn)

        taskList.appendChild(li)


    }

    taskList.addEventListener('click', (event) => {

        if(event.target.classList.contains('check')){
            event.stopPropagation()
            tickUntickTask(event.target.parentElement)

        }else if(event.target.classList.contains('check-btn')){
            tickUntickTask(event.target)

        }else if(event.target.classList.contains('del')){
            removeTask(event.target.parentElement)

        }else if(event.target.classList.contains('del-btn')){
            removeTask(event.target)
        }
    })

    function removeTask(element){
        const li = (element.parentElement)
        let taskId = Number(li.dataset.taskId)
        tasks = tasks.filter(task => task.id !== taskId)
        saveTask()
        li.remove()

    }

    function tickUntickTask(element){
        const li = (element.parentElement)
        li.classList.toggle('task-completed')

        tasks = tasks.map(task => task.id === Number(li.dataset.taskId) ? {...task, isCompleted: !task.isCompleted} : {...task})
        saveTask()


    }

    function saveTask(){
        localStorage.setItem('tasks', JSON.stringify(tasks))
        activeTasks = tasks.filter(task => task.isCompleted === false)
        completedTasks = tasks.filter(task => task.isCompleted === true)
    }
})
