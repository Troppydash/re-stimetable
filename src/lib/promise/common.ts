export namespace PromiseHelpers {
    export function WaitUntil(fn: () => boolean, delay: number = 100): Promise<null> {
        return new Promise<null>(resolve => {
            const interval = setInterval(() => {
                if (fn()) {
                    clearInterval(interval);
                    return resolve(null);
                }
            }, delay)
        })
    }

    export function Debounce(fn: any, delay: number = 100): any {
        let hit = false;
        let code = 0;
        return function (...args: any[]) {
            if (hit) {
                clearTimeout(code);
            }
            hit = true;
            code = setTimeout(() => {
                fn(...args);
                hit = false;
            }, delay);
        }
    }
}
