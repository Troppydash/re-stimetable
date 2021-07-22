import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat)

export namespace DateParser {
    export const REQUEST_FORMAT = 'DD-MM-YYYY';
    export const TT_FORMAT = 'DD/MM/YYYY HH:mm:ss';
    export const instance = dayjs;

    export function ReFormat(source: string, format: string, newFormat: string): string {
        return dayjs(source, format).format(newFormat);
    }

    export function AddDays(source: string, format: string, days: number, newFormat: string): string {
        return dayjs(source, format).add(days, 'days').format(newFormat);
    }

    export function TodayForRequest(): string {
        return dayjs().format('DD-MM-YYYY');
    }
}
