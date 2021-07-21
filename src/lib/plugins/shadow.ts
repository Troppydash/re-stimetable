type ValidCallback = (...args: any[]) => any;

interface Storage {
    closures: Record<string, ValidCallback>
}

export default {
    storage: {
        closures: {}
    } as Storage,

    install(app: any, options: object) {
        app.config.globalProperties.$shadow = this;
    },

    register(key: string, method: ValidCallback) {
        this.storage.closures[key] = method;
    },

    evoke(key: string, ...args: any[]): any {
        const value = this.storage.closures[key];
        if (!value) {
            throw new Error("No closure named " + key + " found in storage");
        }

        return value(...args);
    }
};
