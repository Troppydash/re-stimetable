export namespace helpers {
    export function stringLimit(string: string, n: number, ending: string = "..."): string {
        if (string.length < n)
            return string;

        return string.substring(0, n-ending.length) + ending;
    }
}
