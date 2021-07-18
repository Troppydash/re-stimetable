import {Storage, WebStorage} from "@/lib/storage";

const SettingsKeys = [
    'color-mode'
] as const;
type SettingsKeyType = typeof SettingsKeys[number];

const SettingsDefault: Record<SettingsKeyType, string> = {
    "color-mode": "default"
}


export class WebSettings {
    public static instance = new WebSettings(Storage);

    constructor(private storage: WebStorage) {
    }

    public async init() {
        for (const setting of SettingsKeys) {
            if (!await this.storage.exists(setting)) {
                // ignore error because it never fails
                await this.storage.store(setting, SettingsDefault[setting]);
            }
        }
        await this.storage.commit();
    }

    public async getSetting(key: SettingsKeyType) {
        return await this.storage.view(key);
    }

    public async setSetting(key: SettingsKeyType, value: any) {
        await this.storage.store(key, value);
    }

}
