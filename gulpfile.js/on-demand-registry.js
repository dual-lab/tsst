const DefaultRegistry = require("undertaker-registry");
const assert = require("assert");

let internalTaker = null;

function defFallbackOnDemandTasks(name, tasks) {
    const refTask = function() {
        const fn = tasks[name];
        assert.ok(fn, `Error loading tasks[${name}]`);
        return fn.apply(null, arguments);
    };

    refTask.displayName = name;

    return refTask;
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
        let fn = null;
        if (!(name in this._tasks)) {
            fn = this._loading(name);
        } 
        return fn || super.get(name);
    }

    _loading(name) {
        assert.ok(internalTaker, 'The registry should be used inside a undertaker implementations.');
        let taskFn = null;
        try {
            taskFn = require(`${this.tasksLocation}/${name}.js`)(internalTaker);
            internalTaker._setTask(name, taskFn);
        } catch (err) {
            return this.fallbackOnDemandTask(name, this._tasks);
        }
        return null;
    }
}

module.exports = OnDemandRegistry;
