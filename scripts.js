var lists, selectedList
var sampleList = [
    {id: 0, listname: 'College', tasks: [{id: 0, name: 'Java Assignment', done: false}, {id: 1, name: 'DBMS Project', done: false}, {id: 2, name: 'Buy Record Note', done: true}]},
    {id: 1, listname: 'Holidays', tasks: [{id: 0, name: 'Book Movie tickets', done: true}, {id: 1, name: 'Recharge Data Pack', done: false}, {id: 2, name: 'Order Earphone', done: true}]}
]

window.onload = () => {
    lists = JSON.parse(localStorage.getItem('todo-lists')) || sampleList
    selectedList = localStorage.getItem('selected-list') || -1
    console.log(lists)
    renderLists()
    renderTasks()
    updateListTitle()
}

function renderLists(){
    var ul = document.getElementsByClassName('list')[0]
    lists.forEach((l, index) => {
        var li = document.createElement('li')
        li.innerHTML = l.listname
        li.id = 'list' + l.id
        li.classList.add('list-name')
        if(index == selectedList) li.classList.add('active-list')
        li.setAttribute('onclick','selectList(event)')
        ul.appendChild(li)
    })
}

function renderTasks(){
    if(selectedList == -1) {
        document.getElementById('no-task-msg').style.display = 'block'
        document.getElementsByClassName('tasks-present')[0].style.display = 'none'
    }
    else {
        var ul = document.getElementsByClassName('list')[1]
        lists[selectedList].tasks.forEach((task) => { 
            var li = document.createElement('li')
            li.innerHTML = task.name
            li.id = 'task' + task.id
            li.classList.add('task-name')
            if(task.done) li.classList.add('finished')
            li.setAttribute('onclick','markTask(event)')
            var del = document.createElement('span')
            del.innerHTML = '&#10006;'
            del.classList.add('del-icon')
            del.setAttribute('onclick','deleteTask('+task.id+')')
            li.appendChild(del)
            ul.appendChild(li)
        })
        updateRemainingTasks()
    }
}

function selectList(event){
    if(selectedList == -1) {
        document.getElementById('no-task-msg').style.display = 'none'
        document.getElementsByClassName('tasks-present')[0].style.display = 'block'   
    }
    else {
        document.getElementById('list'+lists[selectedList].id).classList.remove('active-list')
        var ul = Array.from(document.getElementsByClassName('list')[1].getElementsByTagName('li'))
        ul.forEach(li => li.remove())
    }
    var id = Number(event.target.id.substring(4))
    selectedList = getIndexById(id, lists)
    localStorage.setItem('selected-list', selectedList)
    document.getElementById(event.target.id).classList.add('active-list')
    renderTasks()
    updateListTitle()
}

function markTask(event){
    var li = document.getElementById(event.target.id)
    if(!li) return
    var id = Number(event.target.id.substring(4))
    var x = lists[selectedList].tasks[getIndexById(id, lists[selectedList].tasks)].done
    lists[selectedList].tasks[getIndexById(id, lists[selectedList].tasks)].done = !x
    if(x) li.classList.remove('finished')
    else li.classList.add('finished')
    localStorage.setItem('todo-lists', JSON.stringify(lists))
    updateRemainingTasks()
}

function getIndexById(id, a){
    var l = 0, h = a.length - 1
    while(l <= h){
        var mid = Math.floor((l+h)/2)
        if(a[mid].id == id)
            return mid
        if(a[mid].id > id)
            h = mid - 1
        else 
            l = mid + 1
    }
}

function addTask(){
    /* if(event.code == 'Enter'){
        const name = document.getElementById(event.target.id).value
        if(!name) return
        const task = createTask(name)
        lists[selectedList].tasks.push(task)
        localStorage.setItem('todo-lists', JSON.stringify(lists))
        location.reload()
    }
    else */{
        const name = document.getElementById('new-task').value
        if(!name) return
        const task = createTask(name)
        lists[selectedList].tasks.push(task)
        localStorage.setItem('todo-lists', JSON.stringify(lists))
        //location.reload()
    }
}

function createTask(name){
    lastTask = lists[selectedList].tasks[lists[selectedList].tasks.length-1]
    return {
        id: lastTask? lastTask.id + 1 : 0,
        name: name,
        done: false
    }
}

function deleteTask(taskId){
    lists[selectedList].tasks = lists[selectedList].tasks.filter(task => task.id != taskId)
    localStorage.setItem('todo-lists', JSON.stringify(lists))
    document.getElementById('task'+taskId).remove()
    updateRemainingTasks()
}

function updateListTitle(){
    if(selectedList >= 0)
        document.getElementById('list-title').innerHTML = lists[selectedList].listname
    else {
        document.getElementsByClassName('tasks')[0]
    }
}

function updateRemainingTasks(){
    remaining = lists[selectedList].tasks.reduce((rem, task) => {
        return rem + !task.done
    }, 0)
    if(remaining == 1) remaining = '1 task remaining'
    else remaining = remaining + ' tasks remaining'
    document.getElementById('remaining').innerHTML = remaining
}

function markAllTasks(){
    lists[selectedList].tasks.forEach(task => {
        if(!task.done){
            task.done = true
            document.getElementById('task'+task.id).classList.add('finished')
        }
    })
    localStorage.setItem('todo-lists', JSON.stringify(lists))
    updateRemainingTasks()
}

function clearFinishedTasks(){
    lists[selectedList].tasks.forEach(task => {
        if(task.done)
            document.getElementById('task'+task.id).remove()
    })
    lists[selectedList].tasks = lists[selectedList].tasks.filter(task => !task.done)
    localStorage.setItem('todo-lists', JSON.stringify(lists))
}

function addList(event){
    if(event.code == 'Enter'){
        if(!lists) {
            document.getElementById('lists-present').style.display = 'block'
            document.getElementById('no-list-msg').style.display = 'none'
        }
        const name = document.getElementById(event.target.id).value
        if(!name) return
        const list = createList(name)
        lists.push(list)
        localStorage.setItem('todo-lists', JSON.stringify(lists))
        location.reload()
    }
}

function createList(name){
    lastList = lists[lists.length - 1]
    return {
        id: lastList? lastList.id + 1 : 0,
        listname: name,
        tasks: []
    }
}

function deleteList(){
    lists = lists.filter((list, index) => index != selectedList)
    localStorage.setItem('todo-lists', JSON.stringify(lists))
    localStorage.removeItem('selected-list')
    location.reload()
}