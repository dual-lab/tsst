const log = require("fancy-log");

exports.validateCommitHeader = function (header) {
    log.info("Validating rules for ' ", header, "'");
    const rulesEngine = CommitHeaderRules.buildRules(header);
    if (rulesEngine.matchTheTemplate) {
        if (rulesEngine.hasAType) {
            if (!rulesEngine.hasAScope) throw new Error(`The commit does not have a correct scope. See contributing.`);
        } else {
            throw new Error(`The commit does not have a correct type. See contributing.`);
        }
    } else {
        throw new Error(`The commit does not match the correct template
template : type[(scope)]:message
commit: "${header}"`);
    }
}

class CommitHeaderRules {

    static buildRules(msg) { return new CommitHeaderRules(msg); }

    constructor(msg) {
        this.pattern = /^(\w+)(?:\(([^)]+)\))?: (?:.+)$/;
        this.header = this.pattern.exec(msg);
        this.types = {
            feat: {
                desc: 'A new app feature.',
                hasScope: true
            },
            fix: {
                desc: 'A bug fix.',
                hasScope: true
            },
            refactor: {
                desc: 'A code change that not add a new feature or fix a bug.',
                hasScope: true
            },
            style: {
                desc: 'A change that is not related to the code (formatting only).',
                hasScope: true
            },
            docs: {
                desc: 'A change related to documentation only',
                hasScope: true
            },
            build: {
                desc: 'Everything related to build process.',
                hasScope: false
            },
            revert: {
                desc: 'Revert a previus commit',
                hadScope: false
            }

        };
        this.scopes = {
            aot: 'Ahead of time scope',
            jit: 'Just in time scope',
            core: 'Core scope'
        }
    }

    get matchTheTemplate() {
        return !!this.header;
    }

    get hasAType() {
        return this.header[1] in this.types;
    }

    get hasAScope() {
        const type = this.types[this.header[1]];
        return !type.hasScope || (this.header[2] in this.scopes);
    }
}
