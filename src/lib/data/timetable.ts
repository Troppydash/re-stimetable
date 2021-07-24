// WEB DATA TYPES
import {DateParser} from "@/lib/dates/dateParser";

export type WebTimetableData = WebTimetableDay[];

export interface WebTimetableDay {
    Date: string;
    DateFormatted: string;
    DayName: string;
    periodData: WebTimetablePeriod[];
}

export interface WebTimetablePeriod {
    PeriodID: string;
    FromTime: string;
    ToTime: string;
    Heading: string;
    teacherTimeTable: WebAdditionalData;
}

export interface WebAdditionalData {
    Abbrev: string;
    Desc: string;
    Period: string;
    Room: string;
    Teacher: string;
    Year: string;
    Date: string;
    TeacherCode: string;
    Subject: string;
    Class: string;
}

// CLIENT DATA TYPES
export type TimetableData = Record<string, TimetableDay>;
export type TimetableDay = TimetablePeriod[];

export interface TimetablePeriod {
    PeriodID: number;
    FromTime: string;
    ToTime: string;
    Subject: string;
    Class: number;
    Room: string;
    Abbrev: string;
    Date: string;
    Teacher: string;
}

export const EMPTY_PERIOD: TimetablePeriod = {
    ToTime: '0:00',
    FromTime: '0:00',
    PeriodID: 0,
    Subject: '',
    Abbrev: '',
    Class: 0,
    Date: '',
    Room: '',
    Teacher: '',
}

export interface PeriodDescription {
    inShort: string;
    spec: {
        type: string;
        examples: string[];
    } | object;
}

export const PERIOD_DESCRIPTION: Partial<Record<keyof TimetablePeriod, PeriodDescription>> = {
    FromTime: {
        inShort: 'The Period Start Time',
        spec: {
            type: 'string',
            examples: ['09:35', '10:25', '13:15'],
            format: '[hour]:[minute]'
        }
    },
    ToTime: {
        inShort: 'The Period End Time',
        spec: {
            type: 'string',
            examples: ['09:35', '10:25', '13:15'],
            format: '[hour]:[minute]'
        }
    },
    PeriodID: {
        inShort: 'Indicating the nth Period of the Day',
        spec: {
            type: 'number',
            examples: ['1', '5', '6'],
            format: '[nth]'
        }
    },
    Room: {
        inShort: 'The Room Code of the Period Classroom',
        spec: {
            type: 'string',
            examples: ['CL1', 'S12', 'MCK11'],
            format: '[code]'
        }
    },
    Subject: {
        inShort: 'The Subject of the Period',
        spec: {
            type: 'string',
            examples: ['Economics', 'SL Chemistry', 'English'],
            format: '[subject]',
        }
    },
    Date: {
        inShort: 'The Date of this Period',
        spec: {
            type: 'string',
            examples: ['2021-09-21', '2022-01-07', '2019-02-05'],
            format: '[year]/[months]/[day]',
        }
    },
    Teacher: {
        inShort: 'The Teacher of this Period',
        spec: {
            type: 'string',
            examples: ['Ms Y A Do', 'Mr W P Jeffery'],
            format: '[m] [f-name] [m-name] [lastname]'
        }
    },
    Class: {
        inShort: 'The Unique Class ID of the Period',
        spec: {
            type: 'number',
            examples: ['72', '51', '233'],
            format: '[id]'
        }
    }
};

export namespace TimetableHelpers {
    export function FromWebData(data: WebTimetableData): TimetableData {
        const out: TimetableData = {};
        for (const day of data) {
            const date = DateParser.ToCommonFormat(day.Date, DateParser.TT_FORMAT);
            out[date]
                = day.periodData.map(period => ({
                PeriodID: +period.PeriodID,
                FromTime: DateParser.ReFormat(period.FromTime, DateParser.TT_TIME, DateParser.COMMON_TIME),
                ToTime: DateParser.ReFormat(period.ToTime, DateParser.TT_TIME, DateParser.COMMON_TIME),
                Subject: period.teacherTimeTable?.Desc ?? period.Heading,
                Abbrev: period.teacherTimeTable?.Abbrev ?? '',
                Class: +period.teacherTimeTable?.Class || 0,
                Date: date,
                Room: period.teacherTimeTable?.Room ?? '',
                Teacher: period.teacherTimeTable?.Teacher ?? '',
            }));
        }
        return out;
    }

    export function ToSortedDays(data: TimetableData): TimetableDay[] {
        return Object.values(data).sort((left: TimetableDay, right: TimetableDay) => {
            const ld = left[0].Date;
            const rd = right[0].Date;
            if (ld === rd) {
                return 0;
            }
            if (DateParser.IsBefore(ld, rd)) {
                return -1;
            }
            return 1;
        });
    }

    export function EncodePeriod({period}: { period: TimetablePeriod }): string {
        return `${period.Date}|${period.PeriodID}|${period.Room}`;
    }

    export function DecodePeriod(encoded: string): { date: string, periodID: string, room: string } {
        const [date, periodID, room] = encoded.split('|');
        return {
            date,
            periodID,
            room
        };
    }

}
