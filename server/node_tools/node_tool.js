module.exports = class NodeTool {

    constructor(details) {
        this._discover = details.discover;
        this._fix = details.fix;
        this.id = details.id;
        this.title = details.title;
        this.description = details.description;
        this.icon = details.icon;
        this.categories = details.categories;
        this.toolCategory = details.toolCategory;
        this.discoverOptions = details.discoverOptions;
        this.fixOptions = details.fixOptions;
    }

    discover() {
        // set last ran...
        // set whatever...
        this._discover();
    }

    fix() {
        // set last ran...
        // set whatever...
        this._fix();
    }

}