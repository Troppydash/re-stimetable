export namespace helpers {
    export function stringLimit(string: string, n: number, ending: string = "..."): string {
        if (string.length < n)
            return string;

        return string.substring(0, n-ending.length) + ending;
    }

    export function debounce(fn: Function, delay: number): Function {
        let timeout: number;
        return function(this: any, ...args: any[]) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        }
    }
}
