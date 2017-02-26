export default class FStorage {
    constructor(prefix) { this.prefix = prefix; }
    preprocess(id) { return this.prefix + '-' + id; }

    load(id) {
        let data = localStorage[this.preprocess(id)];
        return data ? JSON.parse(data) : data;
    }

    store(id, data) {
        localStorage[this.preprocess(id)] = JSON.stringify(data);
    }

    clear(id) {
        localStorage.removeItem(this.preprocess(id));
    }

    checkSupport() {
        let hasSupport = true;
        if (typeof(Storage) === "undefined") {
            // Code for localStorage/sessionStorage.
            console.error("stora: no support for localstorage");
            hasSupport = false;
        }
        return hasSupport;
    }
}
