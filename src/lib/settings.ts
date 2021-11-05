import {Storage, WebStorage} from "@/lib/storage";

const SettingsKeys = [
    'color-mode',
    'user',
    'map',
    'map-closed',
] as const;
type SettingsKeyType = typeof SettingsKeys[number];

const SettingsDefault: Record<SettingsKeyType, any> = {
    "color-mode": "default",

    'user': {
        name: 'unnamed',
        keycode: '',
        visited: false
    },

    "map": {
        quality: 'balanced',  // power-saving, balanced, good, best,
        shadows: 'balanced',  // ``, ``, ``, ``
        smoothCamera: 'on',  // on, off,
        textures: 'off',  // ``, ``
        tod: 'afternoon',  // morning, afternoon, sunset, night, auto
    },

    'map-closed': false,
}

function attemptToOrDefault<T>(fn: () => T, otherwise?: T): T | null {
    try {
        return fn();
    } catch (e) {
        return otherwise ?? null;
    }
}

export class WebSettings {
    public static instance = new WebSettings(Storage);

    constructor(private storage: WebStorage) {
        this.init();
    }

    public init() {
        attemptToOrDefault(() => {
            for (const setting of SettingsKeys) {
                if (!this.storage.exists(setting)) {
                    this.storage.store(setting, SettingsDefault[setting]);
                }
            }
            this.storage.commit();
        });
    }

    public clear() {
        attemptToOrDefault(() => {
            this.storage.clear();
        });
    }

    public getSetting(key: SettingsKeyType) {
        return attemptToOrDefault(() => this.storage.view(key), {});
    }

    public setSetting(key: SettingsKeyType, value: any) {
        attemptToOrDefault(() => {
            this.storage.store(key, value);
            this.storage.commit();
        });
    }

    public updateSettings(key: SettingsKeyType, value: any) {
        attemptToOrDefault(() => {
            const current = this.getSetting(key);
            this.setSetting(key, {...current, ...value});
        });
    }
}
