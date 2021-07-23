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
    Subject: number;
    Class: number;
    Room: string;
    Abbrev: string;
    Desc: string;
    Date: string;
    Teacher: string;
    TeacherCode: string;
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
            examples: ['9:35', '10:25', '13:15'],
            format: '[hour]:[minute]'
        }
    },
    ToTime: {
        inShort: 'The Period End Time',
        spec: {
            type: 'string',
            examples: ['9:35', '10:25', '13:15'],
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
    Desc: {
        inShort: 'A Description of the Class as a Subject',
        spec: {
            type: 'string',
            examples: ['Economics', 'SL Chemistry', 'English'],
            format: '[subject]',
        }
    },
    Date: {
        inShort: 'The Day of this Period',
        spec: {
            type: 'string',
            examples: ['21/09/2021', '01/07/2022', '15/02/2019'],
            format: '[day]/[month]/[year]',
        }
    },
    Teacher: {
        inShort: 'The Teacher of this Period',
        spec: {
            type: 'string',
            examples: ['Ms Y A Do', 'Mr W P Jeffery'],
            format: '[m] [f-name] [m-name] [lastname]'
        }
    }
};

export function ConvertData(data: WebTimetableData): TimetableData {
    const out: TimetableData = {};
    for (const day of data) {
        const date = DateParser.ToCommonFormat(day.Date, DateParser.TT_FORMAT);
        out[date]
            = day.periodData.map(period => ({
            PeriodID: +period.PeriodID,
            FromTime: period.FromTime,
            ToTime: period.ToTime,
            Subject: +period.teacherTimeTable?.Subject ?? 0,
            Abbrev: period.teacherTimeTable?.Abbrev ?? '',
            Class: +period.teacherTimeTable?.Class ?? 0,
            Date: date,
            Desc: period.teacherTimeTable?.Desc ?? '',
            Room: period.teacherTimeTable?.Room ?? '',
            Teacher: period.teacherTimeTable?.Teacher ?? '',
            TeacherCode: period.teacherTimeTable?.TeacherCode ?? ''
        }));
    }
    return out;
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
