import { generate as id } from 'shortid';
import { Dispatcher, ReduceStore } from './flux';

const taskDispatcher = new Dispatcher();

const CREATETASK = 'CREATETASK';
const COMPLETETASK = 'COMPLETETASK';
const SHOWTASK = 'SHOWTASK';

const createTaskAction = (content) => {
    return {
        type: CREATETASK,
        value: content,
    }
}

const showTaskAction = (show) => {
    return {
        type: SHOWTASK,
        value: show,
    }
}

const completeTaskAction = (id, isComplete) => {
    return {
        type: COMPLETETASK,
        id,
        value: isComplete,
    }
}

class TasksStore extends ReduceStore {
    getInitialState() {
        return {
            tasks: [
                {
                    id: id(),
                    content: 'Learn flux',
                    complete: false,
                },
                {
                    id: id(),
                    content: 'Learn redux',
                    complete: false,
                },
                {
                    id: id(),
                    content: 'Learn react with flux',
                    complete: true,
                },
                {
                    id: id(),
                    content: 'Learn react with redux',
                    complete: false ,
                }
            ],
            showComplete: true,
        }
    }
    getState() {
        return this.__state;
    }
    reduce(state, action) {
        console.log('Current state is ', state, action);
        let newState;
        switch(action.type) {
            case CREATETASK: {
                newState = { ...state, tasks: [...state.tasks] };
                newState.tasks.push({
                    id: id(),
                    content: action.value,
                    complete: false,
                })
                return newState;
            }
            case SHOWTASK: {
                newState = {...state, tasks: [...state.tasks], showComplete: action.value};
                return newState;
            }
             case COMPLETETASK: {
                newState = {...state, tasks: [...state.tasks]};
                const affectedElementIndex = newState.tasks.findIndex(t => t.id === action.id);
                newState.tasks[affectedElementIndex] = {...state.tasks[affectedElementIndex], complete:action.value} 
                return newState;
            }
        }
        return state;
    }
}

const TaskComponent = ({content, complete, id}) => (
     `<section>
        ${content} <input type="checkbox" name="taskCompleted" data-taskid=${id} ${complete ? 'checked': ''} />
    </section>`
)

const render = () => {
    const tasksSection = document.getElementById('tasks');
    const state = tasksStore.getState();
    const rendered = state.tasks
        .filter(task => state.showComplete ? true : !task.complete)
        .map(TaskComponent).join('');
    tasksSection.innerHTML = rendered;
    document.getElementsByName('taskCompleted').forEach(element => {
        element.addEventListener('change', ({ target }) => {
            taskDispatcher.dispatch(completeTaskAction(target.attributes['data-taskid'].value, target.checked));
        });
    });
}

document.forms.newTask.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.newTaskName.value;
    taskDispatcher.dispatch(createTaskAction(name));
    e.target.newTaskName.value = null;
});

document.forms.undo.addEventListener('submit', (e) => {
    e.preventDefault();
    tasksStore.revertLastState();
})

document.getElementById('showComplete').addEventListener('change', ({ target }) => {
    const showComplete = target.checked;
    taskDispatcher.dispatch(showTaskAction(showComplete)); 
})

const tasksStore = new TasksStore(taskDispatcher);

taskDispatcher.dispatch('TODO_ADDTASK'); 

tasksStore.addListener(() => {
    render();
})

render();