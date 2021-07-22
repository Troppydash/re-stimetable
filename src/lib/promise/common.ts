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
}
