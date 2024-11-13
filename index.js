document.addEventListener('DOMContentLoaded', () => {
    let inputBox = document.querySelector('input')
    let addTaskBtn = document.querySelector('.add-task')
    let taskList = document.querySelector('ul')
    let filterTasks = document.querySelector('.filter')
    let allTab = document.querySelector('.all')
    let activeTab = document.querySelector('.active')
    let completedTab = document.querySelector('.completed')
    let activeTaskCount = document.querySelector('#count')
    let clearCompletedTask = document.querySelector('.clear-completed')
    let previousTaskId
    let removeTaskFromList

    const para = document.createElement('p')
    para.classList.add('empty')
    para.textContent = '0 Task Added'
    taskList.appendChild(para)

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    let activeTasks = tasks.filter(task => task.isCompleted === false)
    let completedTasks = tasks.filter(task => task.isCompleted === true)


    activeTaskCount.textContent = activeTasks.length < 2 ? `${activeTasks.length} item left` : `${activeTasks.length} items left`
    tasks.forEach(task => showTasks(task));


    if(tasks.length < 1){
        para.textContent = '0 Task Added'
        taskList.appendChild(para)
        para.style.display = 'block'
    }


    addTaskBtn.addEventListener('click', (event) => addTask(event))

    taskList.addEventListener('click', (event) => {

        if(event.target.classList.contains('check')){
            tickUntickTask(event.target.parentElement)

        }else if(event.target.classList.contains('check-btn')){
            tickUntickTask(event.target)

        }else if(event.target.classList.contains('del')){
            removeTask(event.target.parentElement)

        }else if(event.target.classList.contains('del-btn')){
            removeTask(event.target)
        }

        event.stopPropagation()

    })

    filterTasks.addEventListener('click', (event) => {

        let classNames = ['all', 'active', 'completed']
        if(classNames.some(classname => event.target.classList.contains(classname))){
            taskList.replaceChildren()

        }

        taskList.appendChild(para)
        para.style.display = 'none'

        if(event.target.classList.contains('all')){
            switchView(event.target)
            para.textContent = '0 Task Added'

            if(tasks.length < 1){
                para.style.display = 'block'
            }else{
                tasks.forEach(task => showTasks(task))
            }

        }else if(event.target.classList.contains('active')){

            switchView(event.target)
            para.textContent = '0 Active Task'

            if(activeTasks.length < 1){
                para.style.display = 'block'

            }else{
                activeTasks.forEach(task => showTasks(task))
            }

        }else if(event.target.classList.contains('completed')){

            switchView(event.target)
            para.textContent = '0 Completed Task'

            if(completedTasks.length < 1){
                para.style.display = 'block'

            }else{
                completedTasks.forEach(task => showTasks(task))
            }
        }
    })


    clearCompletedTask.addEventListener('click', () => clearCompleted())


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

        if(!(completedTab.classList.contains('view-visible'))){

            showTasks(newTask)
        }

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

        if(taskList.firstElementChild.classList.contains('empty')){
            para.style.display = 'none'
        }




    }



    function removeTask(element){
        const li = (element.parentElement)
        let taskId = Number(li.dataset.taskId)
        tasks = tasks.filter(task => task.id !== taskId)
        saveTask()
        li.remove()

        if(taskList.childElementCount <= 1){
            para.style.display = 'block'
        }

    }

    function tickUntickTask(element){
        const li = (element.parentElement)
        li.classList.toggle('task-completed')


        tasks = tasks.map(task => task.id === Number(li.dataset.taskId) ? {...task, isCompleted: !task.isCompleted} : {...task})
        saveTask()


        if(activeTab.classList.contains('view-visible')){

            if(previousTaskId === li.dataset.taskId && !(li.classList.contains('task-completed'))){
                clearInterval(removeTaskFromList)
                return
            }

            previousTaskId = li.dataset.taskId

            removeTaskFromList = setTimeout(function(){
                li.remove()
            }, 1200)


        }else if(completedTab.classList.contains('view-visible')){
            if(previousTaskId === li.dataset.taskId && (li.classList.contains('task-completed'))){
                clearInterval(removeTaskFromList)
                return
            }

            previousTaskId = li.dataset.taskId

            removeTaskFromList = setTimeout(function(){
                li.remove()
            }, 1200)
        }

        if(taskList.childElementCount <= 1){
            para.style.display = 'block'
        }


    }

    function saveTask(){
        localStorage.setItem('tasks', JSON.stringify(tasks))
        activeTasks = tasks.filter(task => task.isCompleted === false)
        completedTasks = tasks.filter(task => task.isCompleted === true)

        activeTaskCount.textContent = activeTasks.length < 2 ? `${activeTasks.length} item left` : `${activeTasks.length} items left`
    }

    function switchView(element){
            allTab.classList.add('view-hidden')
            allTab.classList.remove('view-visible')

            activeTab.classList.add('view-hidden')
            activeTab.classList.remove('view-visible')

            completedTab.classList.add('view-hidden')
            completedTab.classList.remove('view-visible')

            element.classList.add('view-visible')
            element.classList.remove('view-hidden')
    }


    function clearCompleted(){
        tasks = tasks.filter(task => !task.isCompleted)
        saveTask()

        let completedTask = document.querySelectorAll('.task-completed')
        completedTask.forEach(element => {
            element.remove()
        })

        if(taskList.childElementCount <= 1){
            para.style.display = 'block'
        }




    }
})
