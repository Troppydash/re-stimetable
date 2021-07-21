import {Storage, WebStorage} from "@/lib/storage";

const SettingsKeys = [
    'color-mode',
    'user-name',
    'user-keycode'
] as const;
type SettingsKeyType = typeof SettingsKeys[number];

const SettingsDefault: Record<SettingsKeyType, string> = {
    "color-mode": "default",
    'user-name': 'unnamed',
    'user-keycode': 'qi t'
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
