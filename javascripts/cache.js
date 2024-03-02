class Cache {
    constructor() {
        this.cache = new Map(); // Using Map for fast key-based lookup
    }

    get(key, action) {
        if (this.cache.has(key))
            return this.cache.get(key);

        if (action !== null) {
            const result = action();
            this.cache.set(key, result);

            return result;
        }

        return null;
    }

    set(key, value) {
        this.cache.set(key, value);
    }
}

export { Cache };