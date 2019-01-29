const DefaultRegistry = require("undertaker-registry");
const assert = require("assert");

let internalTaker = null;

function defFallbackOnDemandTasks(task, message) {
    return async () => { throw new Error(`Error loading tasks[${task}]: ${message}`) };
}

class OnDemandRegistry extends DefaultRegistry {
    constructor(options) {
        super();
        options = options || {};
        this.tasksLocation = options.tasksLocation || '.';
        this.fallbackOnDemandTask = options.fallbackOnDemandTasks || defFallbackOnDemandTasks;
    }

    init(taker) {
        internalTaker = taker;
    }

    get(name) {
        if (!(name in this._tasks)) this._loading(name);
        return super.get(name);
    }

    _loading(name) {
        assert.ok(internalTaker, 'The registry should be used inside a undertaker implementations.');
        let taskFn = null;
        try {
            taskFn = require(`${this.tasksLocation}/${name}.js`)(internalTaker);
        } catch (err) {
            taskFn = this.fallbackOnDemandTask(name, err.message);
        }
        internalTaker._setTask(name, taskFn);
    }
}

module.exports = OnDemandRegistry;
