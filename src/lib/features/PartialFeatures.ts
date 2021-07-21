import {Feature} from "@stimetable/map-renderer/lib/features";
import {CanvasSize, THREEObject} from "@stimetable/map-renderer/lib/renderer";
import {MapRenderer, MapRendererRefs} from "@stimetable/map-renderer/lib/renderer/mapRenderer";

/**
 * A Partial Class to fix the tight dependency on feature
 */
export class PartialFeatures extends Feature {
    onClickBuilding(building: THREEObject, event: PointerEvent): void {
    }

    onControlEnd(): void {
    }

    onControlStart(): void {
    }

    onExitBuilding(building: THREEObject, event: PointerEvent): void {
    }

    onFocusBuilding(newBuilding: THREEObject, oldBuilding?: THREEObject): void {
    }

    onHoverBuilding(building: THREEObject, event: PointerEvent): void {
    }

    onMoveBuilding(building: THREEObject, event: PointerEvent): void {
    }

    onResizeCanvas(newSize: CanvasSize): void {
    }

    onToggleFullscreen(isFullscreen: boolean): void {
    }

    onTraverseChild(child: THREEObject): void {
    }

    runCleanup(): void {
    }

    runSetup(refs: MapRendererRefs, mapRenderer: MapRenderer): void {
    }

}
