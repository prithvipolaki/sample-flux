import { Dispatcher, Store } from './flux';

// create dispatcher object
const controlPanelDispatcher = new Dispatcher();

// Start of constants
const UPDATE_USERNAME = 'UPADTE_USERNAME';
const UPDATE_FONTSIZE = 'UPDATE_FONTSIZE';
// End of constants

// Start of actions 
const userNameUpdate = (name) => {
    return {
        type: UPDATE_USERNAME,
        value: name,
    }
}
const fontSizeUpdateAction = (size) => {
    return {
        type: UPDATE_FONTSIZE,
        value: size,
    }
}
// End of actions

// Start of user actions
document.getElementById('userNameInput').addEventListener('input', ({target}) => {
    const name = target.value;
    console.log('dispatching ', name)
    controlPanelDispatcher.dispatch(userNameUpdate(name));
});
document.forms.fontSizeForm.fontSize.forEach(element => {
    element.addEventListener('change', ({ target }) => {
        const size = target.value;
        console.log(size);
        controlPanelDispatcher.dispatch(fontSizeUpdateAction(size));
    });
});
// End of user actions

// Start of store
class UserPerferenceStore extends Store {
    getInitialState() {
        return localStorage['preferences'] ? JSON.parse(localStorage['preferences']) : {
            userName: 'Jim',
            fontSize: 'small',
        }
    }
    __onDispatch(action) {
        //console.log('store received dispatch', action);
        switch(action.type) {
            case UPDATE_USERNAME:
                this.__state.userName = action.value;
                this.emitChange();
                break;
            case UPDATE_FONTSIZE:
                this.__state.fontSize = action.value;
                this.emitChange();
                break;
        }        
    }
    getuserPreferences() {
        return this.__state;
    }
}
// End of store

const userPerferenceStore = new UserPerferenceStore(controlPanelDispatcher);

userPerferenceStore.addListener((state) => {
    console.log(' current state is ', state);
    render(state);
    localStorage['preferences'] = JSON.stringify(state);
});
const render = ({userName, fontSize}) => {
    document.getElementById('userName').innerText = userName;
    document.getElementsByClassName('container')[0].style.fontSize = fontSize === 'small' ? '16px' : '22px';
    document.forms.fontSizeForm.fontSize.value = fontSize;
}
render(userPerferenceStore.getuserPreferences());
/*controlPanelDispatcher.register(action => {
    console.log('received action ', action);
});*/
