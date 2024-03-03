/**
  Cache class to store and retrieve data efficiently using key-based lookup.
  It utilizes a Map data structure for fast access.
 */

class Cache {

    //Constructs a new Cache instance with an empty Map.
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