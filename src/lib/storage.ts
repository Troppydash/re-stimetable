export interface WebStorage {
    store(key: string, value: any): boolean;

    view(key: string): any;

    exists(key: string): boolean;

    commit(): boolean;
}

// TODO: this is inefficient, but caching may make it better
export class LocalWebStorage implements WebStorage {
    constructor(private database: string) {
    }

    private existsSetting(key: string) {
        const db = localStorage.getItem(this.database);
        if (db === null)
            return false;

        const obj = JSON.parse(db);
        return obj[key] !== undefined;
    }

    private updateSettings(key: string, value: any) {
        let obj: Record<string, any> = {};
        if (localStorage.getItem(this.database) === null) {
            localStorage.setItem(this.database, "{}");
        } else {
            obj = JSON.parse(localStorage.getItem(this.database)!);
        }

        obj[key] = value;
        localStorage.setItem(this.database, JSON.stringify(obj));
    }

    private getSetting(key: string): any | null {
        const db = localStorage.getItem(this.database);
        if (db === null)
            return null;

        const obj = JSON.parse(db);
        return obj[key] === undefined ? null : obj[key];
    }

    public store(key: string, value: any) {
        this.updateSettings(key, value);
        return true;
    }

    public view(key: string) {
        const item = this.getSetting(key);
        return item;
    }

    public exists(key: string) {
        return this.existsSetting(key);
    }

    commit() {
        return true;
    }
}

export const Storage = new LocalWebStorage("preferences");
