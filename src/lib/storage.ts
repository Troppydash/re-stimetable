export interface WebStorage {
    store(key: string, value: any): Promise<boolean>;

    view(key: string): Promise<any>;

    exists(key: string): Promise<boolean>;

    commit(): Promise<boolean>;
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
        return obj[key] === undefined ?? null;
    }

    public store(key: string, value: any) {
        return new Promise<boolean>(resolve => {
            this.updateSettings(key, value);
            resolve(true);
        });
    }

    public view(key: string) {
        return new Promise(resolve => {
            const item = this.getSetting(key);
            resolve(item);
        })
    }

    public exists(key: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            resolve(this.existsSetting(key));
        })
    }

    commit(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

export const Storage = new LocalWebStorage("preferences");
