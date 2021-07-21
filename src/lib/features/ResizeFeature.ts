import {PartialFeatures} from "@/lib/features/PartialFeatures";
import {MapRenderer, MapRendererRefs} from "@stimetable/map-renderer/lib/renderer/mapRenderer";
import {RecursivePartial} from "@stimetable/map-renderer/lib/renderer";
import {DeepAssign} from "@stimetable/map-renderer/lib/renderer/mapRendererSettingsHelpers";
import {helpers} from "@/lib/helpers";

export interface AutoresizeFeatureSettings {
    newSize: (self: ResizeFeature) => {
        width: number,
        height?: number,
    };
    aspectRatio: number;
    delay: number;
}

// TODO: Put this into the repository
export class ResizeFeature extends PartialFeatures {
    private _mapRenderer!: MapRenderer;

    static defaultSettings: AutoresizeFeatureSettings = {
        newSize: () => ({
            width: window.innerWidth
        }),
        aspectRatio: 16 / 9,
        delay: 100,
    }

    private settings: AutoresizeFeatureSettings;

    constructor(
        settings: RecursivePartial<AutoresizeFeatureSettings> = ResizeFeature.defaultSettings,
    ) {
        super();
        this.settings = DeepAssign(ResizeFeature.defaultSettings, settings);
    }

    runCleanup(): void {
        window.removeEventListener('resize', this.autoresize);
    }

    private resize(size: {
        width: number,
        height?: number,
    }) {
        let height;
        if (size.height) {
            height = size.height;
        } else {
            height = size.width / this.settings.aspectRatio;
        }

        this._mapRenderer.resize({
            width: size.width,
            height: height
        });
    }

    private autoresize = async () => {
        const { delay, newSize } = this.settings;
        if (delay === 0) {
            const size = newSize(this);
            this.resize(size);
        } else {
            setTimeout(async () => {
                const size = newSize(this);
                this.resize(size);
            }, delay);
        }
    }

    runSetup(refs: MapRendererRefs, mapRenderer: MapRenderer) {
        this._mapRenderer = mapRenderer;
        window.addEventListener('resize', this.autoresize);
        this.autoresize();
    }
}
