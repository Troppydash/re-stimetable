import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat)

export namespace DateParser {
    export const REQUEST_FORMAT = 'DD-MM-YYYY';
    export const TT_FORMAT = 'DD/MM/YYYY HH:mm:ss';

    export const COMMON_FORMAT = 'YYYY-MM-DD';

    export const COMMON_TIME = 'HH:mm';
    export const TT_TIME = 'hh:mm';

    export const instance = dayjs;

    export function ToCommonFormat(source: string, format: string): string {
        return ReFormat(source, format, COMMON_FORMAT);
    }

    export function ReFormat(source: string, format: string, newFormat: string): string {
        return dayjs(source, format).format(newFormat);
    }

    export function AddDays(source: string, days: number,): string {
        return dayjs(source, COMMON_FORMAT).add(days, 'days').format(COMMON_FORMAT);
    }

    export function IsBefore(source: string, other: string) {
        return dayjs(source, COMMON_FORMAT).isBefore(dayjs(other, COMMON_FORMAT));
    }

    export function TodayForRequest(): string {
        return dayjs().format(REQUEST_FORMAT);
    }

    export function Today(): string {
        return dayjs().format(COMMON_FORMAT);
    }

}
