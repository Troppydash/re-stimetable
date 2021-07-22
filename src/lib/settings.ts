import {Storage, WebStorage} from "@/lib/storage";

const SettingsKeys = [
    'color-mode',
    'user',
    'map',
    'map-closed'
] as const;
type SettingsKeyType = typeof SettingsKeys[number];

const SettingsDefault: Record<SettingsKeyType, any> = {
    "color-mode": "default",

    'user': {
        name: 'unnamed',
        keycode: 'qi t',
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


export class WebSettings {
    public static instance = new WebSettings(Storage);

    constructor(private storage: WebStorage) {
        this.init();
    }

    public init() {
        for (const setting of SettingsKeys) {
            if (!this.storage.exists(setting)) {
                this.storage.store(setting, SettingsDefault[setting]);
            }
        }
        this.storage.commit();
    }

    public getSetting(key: SettingsKeyType) {
        return this.storage.view(key);
    }

    public setSetting(key: SettingsKeyType, value: any) {
        this.storage.store(key, value);
        this.storage.commit();
    }

}
