import loadApi from './utils/loaders/loadApi';

class Api {
    constructor () {
        this.api = (typeof window != 'undefined' && window.ymaps) ? window.ymaps : null;
    }

    setAPI (instance) {
        this.api = instance;

        return this.api;
    }

    getAPI () {
        return this.api;
    }

    isAvailible () {
        return Boolean(this.api);
    }

    /**
     * Loading API
     * @return {Promise}
     */
    load (options={}) {
        return loadApi(options).then((instance) => {
            this.api = instance;
            return instance;
        });
    }

    getApiPromise () {
        if (this.api) {
            return Promise.resolve(this.api);
        } else {
            return this.load();
        }
    }
}

export default new Api();
