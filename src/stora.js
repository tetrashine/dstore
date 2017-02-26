// sync between localstorage, memory and server backend
// does not cater for real-time in this version, meant for data that is
// downloaded and used forever in the session.

// ┌ backend
// ├ frontend (javascript)
// └ stora
//      ├ memory
//      └ localstorage/indexedDb

// Q1: Is there support for SQL?
// Q2: Fallback for non-localstorage
// Q3: Auto-sync with backend for real-time
// Q4: Authentication?

import Sync from 'sync';
import FStorage from 'fstorage';

// initialize
//  - load settings
//  - foreach settings
//      + load data
// register
//  - check if data loaded
//      if already exist in data
//          + ensure data loaded
//      else
//          + load data
//
class Stora {
    constructor(opts={}) {
        this.opts = {
            lazy: false
        };
        this.listeners = {};
        this.syncs = {};
        this.storage = new FStorage('stora');
        if (this.storage.checkSupport()) {
            this.load();
        }
    }

    clearBackup() {
        let ids = this.getIds();
        this.storage.clear('settings');
        ids.forEach(id => {
            this.storage.clear(id);
        });
    }

    backup() {
        let syncs = this.getSyncs();
        this.backupSettings();
        for (var key in syncs) {
            if (syncs.hasOwnProperty(key)) {
                this.storage.store(key, syncs[key]);
            }
        }
    }

    backupSettings() {
        let ids = this.getIds();
        this.storage.store("settings", ids);
    }

    backupById(id) {
        this.storage.store(id, this.getSync(id));
    }

    load() {
        let settings = this.settings = this.storage.load("settings");
        if (settings) {
            settings.forEach(id => {
                this.addSync(id, Sync.convert(this.storage.load(id)));
            });
        }
    }

    getIds() { return Object.keys(this.syncs); }
    getSyncs() { return this.syncs; }
    getSync(id) { return this.syncs[id]; }
    addSync(id, sync) { this.syncs[id] = sync; }

    // Register a sync object to be sync-ed
    register(id, url) {

        //check if exist
        let success = false,
            sync = this.getSync(id);

        // if exist, check if data loaded
        if (sync && sync.validUrl(url)) {
            // yes, do nothing
            if (sync.isReady()) {

            } else {

            }
        } else {
            //  no, create and sync
            sync = new Sync(id, url);
            if (sync.valid()) {

                // load and set data if exist in storage
                // else load from site
                let data = this.storage.load(id);
                if (data) {
                    sync.set(data);
                } else {
                    sync.sync((id, data) => {
                        this.backupById(id);

                        if (this.listeners[id]) {
                            this.listeners[id].forEach(listener => {
                                listener(data);
                            });
                            this.listeners[id] = null;
                        }
                    });
                }

                this.addSync(id, sync);
                success = true;
                this.backupSettings();
            }
        }

        return success;
    }

    // Check if sync class by id is sync-ed
    isSync(id) {
        let sync = this.getSync(id);
        return sync && sync.isReady();
    }

    // Get data by id
    get(id) {
        let ret = null;
        if (this.isSync(id)) {
            ret = this.getSync(id).get();
        }
        return ret;
    }

    getAsync(id, callback) {
        let ret = null;
        if (this.isSync(id)) {
            ret = this.getSync(id).get();
            callback(ret);
        } else {
            let rightListener = this.listeners[id];
            if (rightListener) {
                this.listeners[id].push(callback);
            } else {
                this.listeners[id] = [callback];
            }
        }
    }
}

export default new Stora();
