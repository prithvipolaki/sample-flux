export class Store {
    constructor(dispatcher) {
        this.__listeners = [];
        this.__state = this.getInitialState();
        dispatcher.register(this.__onDispatch.bind(this))
    }

    __onDispatch() {
        throw new Error('Sub class must over ride this method');
    }

    getInitialState() {
        throw new Error('Sub class must over ride this method');
    }

    addListener(listener) {
        this.__listeners.push(listener);
    }

    emitChange() {
        this.__listeners.forEach(listener => listener(this.__state))
    }
}