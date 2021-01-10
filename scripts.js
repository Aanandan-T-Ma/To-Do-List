var lists, selectedList

window.onload = () => {
    lists = JSON.parse(localStorage.getItem('todo-lists')) || []
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
    if(selectedList === -1) return;
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

function selectList(event){
    document.getElementById('list'+lists[selectedList].id).classList.remove('active-list')
    var ul = Array.from(document.getElementsByClassName('list')[1].getElementsByTagName('li'))
    ul.forEach(li => li.remove())
    var id = Number(event.target.id.substring(4))
    selectedList = getIndexById(id, 'list')
    localStorage.setItem('selected-list', selectedList)
    document.getElementById(event.target.id).classList.add('active-list')
    renderTasks()
    updateListTitle()
}

function markTask(event){
    var li = document.getElementById(event.target.id)
    if(!li) return
    var id = Number(event.target.id.substring(4))
    var x = lists[selectedList].tasks[getIndexById(id, 'task')].done
    lists[selectedList].tasks[getIndexById(id, 'task')].done = !x
    if(x) li.classList.remove('finished')
    else li.classList.add('finished')
    localStorage.setItem('todo-lists', JSON.stringify(lists))
    updateRemainingTasks()
}

function addTask(event){
    if(event.code == 'Enter'){
        const name = document.getElementById(event.target.id).value
        if(!name){ 
            alert('Empty!')
            return
        }
        const task = createTask(name)
        lists[selectedList].tasks.push(task)
        console.log(JSON.stringify(lists))
        localStorage.setItem('todo-lists', JSON.stringify(lists))
        location.reload()
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
    document.getElementById('list-title').innerHTML = lists[selectedList].listname
}

function updateRemainingTasks(){
    remaining = lists[selectedList].tasks.reduce((rem, task) => {
        return rem + !task.done
    }, 0)
    if(remaining == 1) remaining = '1 task remaining'
    else remaining = remaining + ' tasks remaining'
    document.getElementById('remaining').innerHTML = remaining
    console.log(remaining)
}

function getIndexById(id, lt){
    var l = 0, h = lists.length - 1
    var a = lists
    if(lt == 'task'){ 
        h = lists[selectedList].tasks.length - 1
        a = lists[selectedList].tasks
    }
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