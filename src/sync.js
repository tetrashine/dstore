import $ from 'jquery';

export default class Sync {
    constructor(id, url) {
        this.id = id;
        this.url = url;
        this.data = null;
        this.synced = false;
    }

    isReady() { return this.synced; }

    get() { return this.data; }

    set(data) {
        this.data = data;
        this.synced = true;
    }

    sync(callback) {
        // ajax to url
        $.ajax({
            url: this.url
        }).done(data => {
            this.data = data;
            this.synced = true;
            if (callback) callback(this.id, data);
        });
    }
    valid() { return true; }
    validUrl(url) { return this.url === url; }

    copy(obj) {
        this.id = obj.id;
        this.url = obj.url;
        this.data = obj.data;
        this.synced = obj.synced;
    }

    static convert(obj) {
        let sync = new Sync();
        sync.copy(obj);
        return sync;
    }
}
