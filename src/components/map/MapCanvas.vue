<template>
    <div v-show="!closed" class="map-container" :class="{'map-container--fs': isFs}">
        <div v-show="isFs || !isSmall" class="map-sidebar">
            <div class="map-siderbar__body" v-show="isSidebarOpen">
                <!-- TODO: Make this a flex box so more settings can scroll -->
                <p class="st-text st-text--150 settings-text">Settings</p>
                <form class="st-form" @submit.prevent="applySettings">
                    <div class="st-form__control st-form__control--small" style="margin: 1rem 0">
                        <label class="st-form__label st-form__label--settings">
                            <span>Presets</span>
                            <select class="st-select st-select--small" v-model="preset">
                                <option value="low">Potato</option>
                                <option value="medium">Decent</option>
                                <option value="high">Good</option>
                                <option value="veryHigh">Best</option>
                                <option value="custom" disabled>Custom</option>
                            </select>
                        </label>
                    </div>
                    <div class="st-form__control st-form__control--small">
                        <label class="st-form__label st-form__label--settings">
                            <span>Quality</span>
                            <select class="st-select st-select--small" v-model="settings.quality">
                                <option value="power-saving">Power Saving</option>
                                <option value="balanced">Balanced</option>
                                <option value="good">Good</option>
                                <option value="best">Best</option>
                            </select>
                        </label>
                    </div>
                    <div class="st-form__control st-form__control--small">
                        <label class="st-form__label st-form__label--settings">
                            <span>Shadows</span>
                            <select class="st-select st-select--small" v-model="settings.shadows">
                                <option value="power-saving">Power Saving</option>
                                <option value="balanced">Balanced</option>
                                <option value="good">Good</option>
                                <option value="best">Best</option>
                            </select>
                        </label>
                    </div>
                    <div class="st-form__control st-form__control--small">
                        <label class="st-form__label st-form__label--settings">
                            <span>Smooth Camera</span>
                            <select class="st-select st-select--small" v-model="settings.smoothCamera">
                                <option value="on">On</option>
                                <option value="off">Off</option>
                            </select>
                        </label>
                    </div>
                    <div class="st-form__control st-form__control--small">
                        <label class="st-form__label st-form__label--settings">
                            <span>Textures</span>
                            <select class="st-select st-select--small" v-model="settings.textures">
                                <option value="on">On</option>
                                <option value="off">Off</option>
                            </select>
                        </label>
                    </div>
                    <div class="st-form__control st-form__control--small">
                        <label class="st-form__label st-form__label--settings">
                            <span>Time Of Day</span>
                            <select class="st-select st-select--small" v-model="settings.tod">
                                <option value="auto">Auto</option>
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                                <option value="sunset">Sunset</option>
                                <option value="night">Evening</option>
                            </select>
                        </label>
                    </div>
                    <div class="st-form__control st-form__control--small">
                        <button class="st-button st-form__submit st-form__submit--medium" type="submit">Save</button>
                    </div>
                </form>
            </div>
            <div class="map-siderbar__toggle" @click="toggleSidebar">
                <i :class="arrowClass"></i>
            </div>
        </div>
        <div class="map-controls">
            <button class="st-fab st-fab--opaque"
                    :class="{'st-fab--small': !isFs && isSmall}"
                    v-if="!fs && closed !== undefined" @click="handleClose">
                <i class="ri-close-line"></i>
            </button>
            <button class="st-fab st-fab--opaque"
                    :class="{'st-fab--small': !isFs && isSmall}"
                    @click="toggleFullscreen">
                <i class="ri-fullscreen-line"></i>
            </button>
        </div>
        <div id="map-tooltip" class="map-tooltip" v-show="tooltip.position.x >= 0">{{ tooltip.text }}</div>
        <div id="map-canvas" class="map-canvas"></div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {MapRendererBuilder} from "@stimetable/map-renderer/lib/renderer";
import {WebSettings} from "@/lib/settings";
import {
    CallbackFeature,
    HighlightingFeature,
    TooltipFeature
} from "@stimetable/map-renderer/lib/features";
import {ResizeFeature} from "@/lib/features/ResizeFeature";

interface MapSettings {
    quality: 'balanced' | 'power-saving' | 'good' | 'best',
    shadows: 'balanced' | 'power-saving' | 'good' | 'best',
    smoothCamera: 'on' | 'off',
    textures: 'on' | 'off',
    tod: 'auto' | 'morning' | 'afternoon' | 'sunset' | 'night',
}

const MapPresets: Record<string, MapSettings> = {
    'low': {
        quality: 'power-saving',
        shadows: 'power-saving',
        smoothCamera: 'off',
        textures: 'off',
        tod: 'afternoon'
    },
    'medium': {
        quality: 'balanced',
        shadows: 'balanced',
        smoothCamera: 'on',
        textures: 'off',
        tod: 'afternoon'
    },
    'high': {
        quality: 'good',
        shadows: 'good',
        smoothCamera: 'on',
        textures: 'on',
        tod: 'auto'
    },
    'veryHigh': {
        quality: 'best',
        shadows: 'best',
        smoothCamera: 'on',
        textures: 'on',
        tod: 'auto'
    },
}

export default defineComponent({
    name: "MapCanvas",
    props: ['closed', 'fs', 'selected', 'isMinimized'],
    data() {
        return {
            builder: null as unknown as (() => MapRendererBuilder | null),
            tooltip: {
                text: '',
                position: {
                    x: -1,
                    y: -1
                }
            },
            isFs: false,
            isSidebarOpen: false,
            settings: {} as MapSettings,
        }
    },
    computed: {
        isSmall(): boolean {
            return !!this.isMinimized;
        },
        arrowClass() {
            if (this.isSidebarOpen) {
                return 'ri-arrow-left-s-fill';
            }
            return 'ri-arrow-right-s-fill';
        },
        preset: {
            get(): string {
                for (const [key, value] of Object.entries(MapPresets)) {
                    if (JSON.stringify(this.settings) === JSON.stringify(value)) {
                        return key;
                    }
                }
                return 'custom';
            },
            set(value: string) {
                if (value === 'custom') {
                    return;
                }
                this.settings = MapPresets[value];
            }
        }
    },
    watch: {
        selected(newValue: string) {
            if (newValue) {
                this.builder()?.instance?.focusBuildingByName(newValue);
            }
        },
        fs(isFs: boolean) {
            if (this.isFs !== isFs) {
                this.toggleFullscreen();
            }
        },
        closed(isClosed: boolean) {
            if (!isClosed) {
                this.loadMap();
            }
        }
    },
    methods: {
        handleClose() {
            this.disposeMap();
            this.$emit('update:closed', true);
        },
        deriveAttributes() {
            const settings: MapSettings = WebSettings.instance.getSetting('map');
            this.settings = settings;

            // texture
            let gltfLocation;
            if (settings.textures === 'on') {
                gltfLocation = '/maps/scots.gltf';
            } else {
                gltfLocation = '/maps/scots-notex.gltf';
            }

            // quality
            let quality;
            switch (settings.quality) {
                case 'balanced':
                    quality = 5;
                    break;
                case "best":
                    quality = 10;
                    break;
                case "good":
                    quality = 7;
                    break;
                case "power-saving":
                    quality = 3;
                    break
            }

            // shadow
            let shadow = settings.shadows !== 'power-saving';

            // smooth
            let smooth = settings.smoothCamera === 'on';

            // advance settings
            let performance = 'default';
            switch (settings.quality) {
                case "power-saving":
                    performance = 'low-power';
                    break;
                case "best":
                    performance = 'high-performance';
                    break;
            }

            let antialias = true;

            let postprocessing = settings.quality === 'best';

            let tod = settings.tod === 'auto' ? undefined : () => settings.tod;

            return {
                gltfLocation,
                quality,
                shadow,
                smooth,
                tod,
                performance,
                antialias,
                postprocessing,
            };
        },
        applySettings() {
            WebSettings.instance.setSetting('map', this.settings);
            this.reloadMap();
        },
        reloadMap() {
            this.disposeMap();
            this.loadMap();
        },
        loadMap() {
            const attributes = this.deriveAttributes();
            const aspectRatio = 16 / 9;

            const canvas = document.getElementById('map-canvas')!;
            const width = canvas.clientWidth;
            const builder = new MapRendererBuilder({
                targetElement: canvas,
                gltfLocation: attributes.gltfLocation,
                quality: attributes.quality,
            }, {
                camera: {
                    smooth: attributes.smooth,
                },
                quality: {
                    antialias: attributes.antialias,
                    postprocessing: attributes.postprocessing,
                    shadow: attributes.shadow
                },
                map: {
                    timeDependedGetTimeOfDay: attributes.tod
                },
                canvas: {
                    size: {
                        width,
                        height: Math.floor(width / aspectRatio)
                    }
                }
            });
            builder
                .addFeature(new TooltipFeature(
                    document.getElementById('map-tooltip')!,
                    (text, position) => {
                        this.tooltip.text = text;
                        this.tooltip.position = {
                            x: position.relX,
                            y: position.relY
                        };
                    }
                ))
                .addFeature(new HighlightingFeature({
                    postprocessing: attributes.postprocessing
                }))
                .addFeature(new ResizeFeature({
                    delay: 100,
                    newSize: () => {
                        if (this.isFs) {
                            return {
                                width: window.innerWidth,
                                height: window.innerHeight
                            };
                        }
                        return {
                            width: canvas.clientWidth
                        };
                    }
                }))
                .addFeature(new CallbackFeature([
                    {
                        method: "onToggleFullscreen",
                        callback: ([isFs]) => {
                            if (isFs) {
                                document.querySelector('body')!.style.overflow = 'hidden';
                            } else {
                                document.querySelector('body')!.style.overflow = 'initial';
                            }

                            this.isFs = isFs;
                            this.$emit('update:fs', isFs);
                        }
                    },
                    {
                        method: 'onClickBuilding',
                        callback: arg => {
                            this.$emit('update:selected', arg[0].name);
                        }
                    }
                ]))
                .register();

            this.builder = () => builder;
        },
        disposeMap() {
            this.builder()?.dispose();
        },
        toggleFullscreen() {
            this.builder()?.instance?.toggleFullscreen();
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
    },
    mounted() {
        this.loadMap();
    },
    beforeUnmount() {
        this.disposeMap()
    }
});
</script>

<style lang="less" scoped>
@import "../../css/fab";

.map-container {
    position: relative;

    &.map-container--fs {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: 30;
    }

    .map-tooltip {
        position: absolute;
        bottom: 4px; // because the div doesn't shrink to the canvas
        right: 0;

        background-color: var(--st-background-hover);
        color: var(--st-text);
        padding: 0.25rem 0.5rem;
        white-space: nowrap;

        border: 1px solid var(--st-text);
        z-index: 10;
        pointer-events: none;
    }

    .map-canvas {
        width: 100%;
        height: 100%;
    }

    .map-sidebar {
        position: absolute;
        bottom: 4px;
        left: 0;
        height: calc(100% - 4px);
        color: #d9d9d9;

        background: rgba(0, 0, 0, 0.29);

        display: flex;

        .map-siderbar__body {
            flex: 1 1;
            min-width: 220px;
            padding: 0.5rem 0.75rem;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .map-siderbar__toggle {
            display: flex;
            align-items: center;
            cursor: pointer;

            &:hover {
                background: rgba(0, 0, 0, 0.12);
            }
        }
    }

    .map-controls {
        position: absolute;
        top: 0.25rem;
        right: 0.5rem;

        display: flex;
        flex-direction: column;
    }
}


.settings-text {
    border-bottom: 2px solid var(--st-primary);
    padding: 0.3rem 0;
}

// BECAUSE I DON'T LIKE IT
.st-form__submit--medium {
    padding: 0.1rem;
}

</style>
