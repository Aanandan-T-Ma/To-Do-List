var lists = [
    { id: 0, listname: 'list1', tasks: [{id: 0, name: 'task1', done: false}, {id: 1, name: 'task2', done: true}, {id: 2, name: 'task3', done: false}] },
    { id: 4, listname: 'list2', tasks: [{id: 0, name: 'task4', done: true}, {id: 1, name: 'task5', done: false}, {id: 2, name: 'task6', done: false}] },
    { id: 736, listname: 'list3', tasks: [{id: 0, name: 'task7', done: false}, {id: 1, name: 'task8', done: false}, {id: 2, name: 'task9', done: false}] }
]
var selectedList = 0;

window.onload = () => {
    renderLists()
    renderTasks()
}

function renderLists(){
    var ul = document.getElementsByClassName('list')[0]
    lists.forEach((l, index) => {
        var li = document.createElement('li')
        li.innerHTML = l.listname
        li.id = 'list' + l.id
        li.classList.add('list-name')
        if(!index) li.classList.add('active-list')
        li.setAttribute('onclick','selectList(event)')
        ul.appendChild(li)
    })
}

function renderTasks(){
    var ul = document.getElementsByClassName('list')[1]
    lists[selectedList].tasks.forEach((task) => {
        var li = document.createElement('li')
        li.innerHTML = task.name
        li.id = 'task' + task.id
        li.classList.add('task-name')
        if(task.done) li.classList.add('finished')
        li.setAttribute('onclick','markTask(event)')
        ul.appendChild(li)
    })
}

function selectList(event){
    document.getElementById('list'+lists[selectedList].id).classList.remove('active-list')
    var ul = Array.from(document.getElementsByClassName('list')[1].getElementsByTagName('li'))
    ul.forEach(li => li.remove())
    var id = Number(event.target.id.substring(4))
    selectedList = getIndexById(id, 'list')
    document.getElementById(event.target.id).classList.add('active-list')
    renderTasks()
}

function markTask(event){
    var id = Number(event.target.id.substring(4))
    var x = lists[selectedList].tasks[getIndexById(id, 'task')].done
    lists[selectedList].tasks[getIndexById(id, 'task')].done = !x
    var li = document.getElementById(event.target.id)
    if(x) li.classList.remove('finished')
    else li.classList.add('finished')
    //console.log(JSON.stringify(lists))
}

function addTask(event){
    if(event.code == 'Enter'){
        lists[selectedList].tasks.push()
        //location.reload()
    }
}

function createTask(name){
    return {
        id: lists[selectedList].tasks[lists[selectedList].tasks.length-1].id + 1,
        name: name,
        done: false
    }
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